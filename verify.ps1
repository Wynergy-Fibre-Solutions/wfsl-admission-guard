<# 
WFSL Admission Guard – Verification Entry Point

Preflight:
- Enforces WFSL Shell Guard execution safety
- Blocks prompt contamination and unsafe invocation

Admission Guard:
- Deny-by-default surface admission
- Deterministic route enforcement

No telemetry. No network access.
#>

Set-StrictMode -Version Latest
$ErrorActionPreference = 'Stop'

function Fail {
    param([string]$Message)
    Write-Error "[WFSL-ADMISSION-GUARD] $Message"
    exit 1
}

# ---------------------------------------------------------------------------
# Preflight: WFSL Shell Guard
# ---------------------------------------------------------------------------

$ShellGuardPath = Join-Path $PSScriptRoot "..\wfsl-shell-guard\src\guard.ps1"

if (-not (Test-Path $ShellGuardPath)) {
    Fail "WFSL Shell Guard not found at expected path: $ShellGuardPath"
}

Write-Host "[WFSL-ADMISSION-GUARD] Running Shell Guard preflight..."

pwsh -NoProfile -ExecutionPolicy Bypass -File $ShellGuardPath

if ($LASTEXITCODE -ne 0) {
    Fail "Shell Guard preflight failed. Admission Guard execution blocked."
}

# ---------------------------------------------------------------------------
# Admission Guard execution
# ---------------------------------------------------------------------------

Write-Host "[WFSL-ADMISSION-GUARD] Shell Guard passed."
Write-Host "[WFSL-ADMISSION-GUARD] Proceeding with admission verification."

# Existing Admission Guard logic continues below
