# Crabhouse 🦀 カニヤシキ

## Set up

### Secrets

Copy `.env.local.example` to `.env.local`, and fill values.

### Secrets for Cloud Functions

```bash
$ npx firebase functions:config:set agora.app_id="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
$ npx firebase functions:config:set agora.app_certificate="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
```

### Secrets for Cloud Functions emulator (`.runtimeconfig.json`)

Give secrets to Cloud Functions.

```bash
$ npx firebase functions:config:get > .runtimeconfig.json
```

### Update local Cloud Function implementation

```bash
$ cd functions/
$ npm run build
```

### Start local server

```bash
$ npm run start
```
