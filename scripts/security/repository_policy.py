"""Portable CI policy checks. No network, application dependencies or secret values.

These checks enforce the repository's conventional block-style workflows; they
complement GitHub's YAML validation and the separate Gitleaks content/history scan.
They do not attest to runtime authorization or organization settings.
"""
from pathlib import Path, PurePosixPath
import re
import subprocess
import sys

ACTION = re.compile(r'\buses\s*:\s*[\"\']?([^\s,\"\'{}]+)')
REMOTE = re.compile(r'[A-Za-z0-9_.-]+/[A-Za-z0-9_.-]+(?:/[A-Za-z0-9_./-]+)?@[a-fA-F0-9]{40}\Z')


def validate_paths(paths):
    errors = []
    for path in paths:
        name = PurePosixPath(path).name.lower()
        template = name.endswith(('.example', '.sample', '.template'))
        if template:
            continue
        sensitive = (name == '.env' or name.startswith('.env.') or
                     name in ('id_rsa', 'id_ed25519', 'id_ecdsa', 'credentials.json', 'secrets.yml', 'secrets.yaml', 'secret.yml', 'secret.yaml') or
                     name.endswith(('.key', '.p12', '.pfx')))
        if sensitive:
            errors.append((path, 'SECRET_FILE: remove tracked credential material and rotate any live credentials'))
    return errors


def validate_workflow(text, path):
    errors = []
    def reject(rule):
        errors.append((path, rule))
    if not re.search(r'^permissions:\s*(?:\n|\{)', text, re.M):
        reject('TOKEN_PERMISSIONS: declare explicit workflow permissions')
    if re.search(r'\bpermissions:\s*write-all\b', text):
        reject('TOKEN_PERMISSIONS: write-all is forbidden')
    if re.search(r'^\s*(?:pull_request_target|workflow_run)\s*:', text, re.M):
        reject('PRIVILEGED_TRIGGER: requires a separately reviewed trust-boundary design')
    if re.search(r'\bon:\s*\[[^\]]*(?:pull_request_target|workflow_run)', text):
        reject('PRIVILEGED_TRIGGER: inline privileged triggers are forbidden')
    if re.search(r'\bon:\s*(?:pull_request_target|workflow_run)\s*$', text, re.M):
        reject('PRIVILEGED_TRIGGER: privileged shorthand trigger is forbidden')
    if re.search(r'\bruns-on:.*\bself-hosted\b', text):
        reject('RUNNER_ISOLATION: self-hosted runners require a separate isolation review')
    for match in ACTION.finditer(text):
        action = match[1]
        if action.startswith('./'):
            continue
        if action.startswith('docker://') and re.search(r'@sha256:[0-9a-f]{64}\Z', action):
            continue
        if not REMOTE.fullmatch(action):
            reject('ACTION_PIN: remote actions must use a complete immutable commit SHA')
        if action.startswith('actions/checkout@'):
            # End at the next step/job; checkout settings must be in this block.
            remaining = text[match.end():]
            boundary = re.search(r'\n(?: {0,4}\S| {6}-\s)', remaining)
            block = remaining[:boundary.start()] if boundary else remaining
            if not re.search(r'^\s+persist-credentials:\s*false\s*(?:#.*)?$', block, re.M):
                reject('CHECKOUT_CREDENTIALS: disable persisted checkout credentials')
    if re.search(r'npm\s+(?:ci|audit)\b[^\n]*\|\|\s*(?:true|npm\s+install)', text):
        reject('FAIL_CLOSED: dependency install/audit failures must not be ignored')
    if re.search(r'git\s+grep\s+-[A-Za-z]*n[A-Za-z]*\s', text):
        reject('REDACTION: repository guards must not print matching source lines')
    if re.search(r'\$\{\{\s*github\.event\.(?:pull_request\.(?:title|body)|issue\.(?:title|body)|comment\.body|head_commit\.message)\s*\}\}', text):
        # Strict by design: pass untrusted event text through an environment
        # variable only after an explicit review of the consuming operation.
        reject('UNTRUSTED_EVENT_TEXT: do not interpolate external text into workflows')
    return errors


def inspect_repository(root, paths):
    errors = validate_paths(paths)
    workflows = [p for p in paths if p.startswith('.github/workflows/') and p.endswith(('.yml', '.yaml'))]
    if not workflows:
        errors.append(('.github/workflows', 'MISSING_CI: no security workflow found'))
    for path in workflows:
        file = root / path
        if file.is_symlink():
            errors.append((path, 'WORKFLOW_SYMLINK: workflow files must be regular files'))
        else:
            errors.extend(validate_workflow(file.read_text(encoding='utf-8'), path))
    return errors


def main():
    root = Path.cwd()
    result = subprocess.run(['git', 'ls-files', '-z'], check=True, capture_output=True)
    paths = result.stdout.decode('utf-8').split('\0')
    errors = inspect_repository(root, [p for p in paths if p])
    for path, rule in errors:
        # repr escapes newlines/control characters in untrusted filenames.
        print(f'{path!r}: {rule}')
    if errors:
        print(f'Security policy failed: {len(errors)} finding(s). Source values are never printed.')
        return 1
    print('Repository security policy passed. Runtime and account controls require separate verification.')
    return 0


if __name__ == '__main__':
    sys.exit(main())
