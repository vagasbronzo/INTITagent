import unittest
from repository_policy import validate_paths, validate_workflow


SHA = '1' * 40
SAFE = f'''name: test
on:
  pull_request:
permissions:
  contents: read
jobs:
  verify:
    runs-on: ubuntu-latest
    timeout-minutes: 10
    steps:
      - uses: actions/checkout@{SHA}
        with:
          persist-credentials: false
      - run: npm ci --ignore-scripts
'''


class SecurityPolicyTests(unittest.TestCase):
    def rules(self, text):
        return [message.split(':')[0] for _, message in validate_workflow(text, 'workflow.yml')]

    def test_read_only_pinned_workflow(self):
        self.assertEqual(self.rules(SAFE), [])

    def test_mutable_action_and_short_sha_are_rejected(self):
        for ref in ('main', 'v4', SHA[:7]):
            with self.subTest(ref=ref):
                self.assertIn('ACTION_PIN', self.rules(SAFE.replace(SHA, ref)))

    def test_malformed_codeql_subaction_is_rejected(self):
        text = SAFE.replace('actions/checkout@'+SHA, 'github/codeql-action@'+SHA+'/init')
        self.assertIn('ACTION_PIN', self.rules(text))

    def test_read_only_permissions_cannot_be_omitted(self):
        self.assertIn('TOKEN_PERMISSIONS', self.rules(SAFE.replace('permissions:\n  contents: read\n', '')))

    def test_write_all_is_rejected(self):
        self.assertIn('TOKEN_PERMISSIONS', self.rules(SAFE.replace('permissions:\n  contents: read', 'permissions: write-all')))

    def test_privileged_events_are_rejected_in_all_common_forms(self):
        for event in ('pull_request_target', 'workflow_run'):
            for trigger in (f'on:\n  {event}:', f'on: [{event}]', f'on: {event}'):
                with self.subTest(trigger=trigger):
                    self.assertIn('PRIVILEGED_TRIGGER', self.rules(SAFE.replace('on:\n  pull_request:', trigger)))

    def test_checkout_credentials_must_be_disabled_in_the_same_step(self):
        self.assertIn('CHECKOUT_CREDENTIALS', self.rules(SAFE.replace('persist-credentials: false', 'persist-credentials: true')))
        malicious = SAFE.replace('        with:\n          persist-credentials: false\n', '')
        malicious += '      - uses: another/action@'+SHA+'\n        with:\n          persist-credentials: false\n'
        self.assertIn('CHECKOUT_CREDENTIALS', self.rules(malicious))

    def test_audit_failure_and_lockfile_fallback_are_rejected(self):
        for command in ('npm audit --audit-level=high || true', 'npm ci || npm install'):
            with self.subTest(command=command):
                self.assertIn('FAIL_CLOSED', self.rules(SAFE.replace('npm ci --ignore-scripts', command)))

    def test_secret_line_output_is_rejected(self):
        self.assertIn('REDACTION', self.rules(SAFE+'      - run: git grep -nEI pattern\n'))

    def test_attacker_controlled_event_interpolation_is_rejected(self):
        payload = '${'+'{ github.event.pull_request.title }'+'}'
        self.assertIn('UNTRUSTED_EVENT_TEXT', self.rules(SAFE+'      - run: echo "'+payload+'"\n'))

    def test_credential_files_are_blocked_but_templates_are_allowed(self):
        bad = ['.env', 'api/.env.production', 'keys/id_ed25519', 'client.key', 'credentials.json']
        self.assertEqual(len(validate_paths(bad)), len(bad))
        self.assertEqual(validate_paths(['.env.example', '.env.sample', '.env.template', 'package-lock.json']), [])

    def test_findings_contain_no_source_values(self):
        sentinel = 'private-material-that-must-never-be-logged'
        findings = validate_workflow(SAFE+'      - run: git grep -nEI "'+sentinel+'"\n', 'test.yml')
        self.assertTrue(findings)
        self.assertNotIn(sentinel, repr(findings))


if __name__ == '__main__':
    unittest.main()
