# LGU Accomplishment Hub — Local Network Setup

## First-time setup

1. Ensure Laragon MySQL is running.
2. Copy `.env.example` to `.env.local` and set the database values if they differ from the local Laragon defaults.
3. Create the database and tables:

   ```powershell
   & "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysql.exe" -u root -e "source database/schema.sql"
   ```

4. Install the application packages:

   ```powershell
   npx bun@1.3.9 install
   ```

## Run for employees on the local network

Start the local-network application server:

```powershell
npx bun@1.3.9 run start
```

Employees can open `http://SERVER-IP:4199` in their browser. Allow inbound TCP port 4199 in Windows Firewall for the private network profile.

The server is intended for a small, trusted LGU local network. Do not expose it directly to the public internet. The current Lovable starter's production server bundle is incompatible with its installed UI build runtime, so use the tested `start` command above; it runs the full application server including the MySQL server functions.

To run on the host PC only while maintaining the app, use:

```powershell
npx bun@1.3.9 run dev -- --host 0.0.0.0
```

## Initial administrator

The first server run creates the administrator configured in `.env.local`. The supplied local configuration uses username `admin` and a temporary password. Change that password immediately after signing in, then keep `.env.local` private.

## Backups

Back up the MySQL database regularly:

```powershell
& "C:\laragon\bin\mysql\mysql-8.4.3-winx64\bin\mysqldump.exe" -u root boac_accomplishment_hub > backup.sql
```

The backup contains employee account details and report content; store it in an access-controlled location.
