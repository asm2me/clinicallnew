$ErrorActionPreference = 'Stop'

$root = 'c:/Users/asm2m/clinicallnew/apps/web/.local-postgres'
$data = Join-Path $root 'data'
$bin = 'C:\Program Files\PostgreSQL\16\bin'

if (Test-Path $root) {
  try {
    & (Join-Path $bin 'pg_ctl.exe') -D $data stop | Out-Null
  } catch {
  }
  Remove-Item -Recurse -Force $root
}

New-Item -ItemType Directory -Path $root | Out-Null

& (Join-Path $bin 'initdb.exe') -D $data -U clinicall --auth=trust --encoding=UTF8 --locale=C
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Add-Content -Path (Join-Path $data 'postgresql.conf') -Value ""
Add-Content -Path (Join-Path $data 'postgresql.conf') -Value "port = 54330"
Add-Content -Path (Join-Path $data 'postgresql.conf') -Value "listen_addresses = '127.0.0.1'"

& (Join-Path $bin 'pg_ctl.exe') -D $data -l (Join-Path $root 'postgres.log') start
if ($LASTEXITCODE -ne 0) { exit $LASTEXITCODE }

Start-Sleep -Seconds 3

& (Join-Path $bin 'createdb.exe') -h 127.0.0.1 -p 54330 -U clinicall clinicall
exit $LASTEXITCODE
