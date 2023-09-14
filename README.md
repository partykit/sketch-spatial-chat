# sketch-spatial-chat

To do:

- [x] Rationalise message submission/recording/display
- [x] Move NPCs to back-end
- [x] Hide users with stale presence from facepile
- [x] Ability to clear chat
- [ ] Safety features for public usage: prevent sign-in/clear chat/etc except with invite code
- [ ] Check mobile view
- [ ] Check path to local dev/usage
- [ ] Scroll as NPC messages fill in
- [ ] When users move, show other users where they go

## Environment configuration

This project uses an `.env` file to configure both the PartyKit server and the Next.js app.

### Local development

For local development, copy `.env.example` file to `.env`, and populate OpenAI API environment variables.

### PartyKit deployment

When you're ready to deploy the PartyKit server, deploy with the following command to upload the environment variables from your `.env` file to the PartyKit platform.

```sh
npx partykit deploy --with-vars
```

### Next.js app deployment

When you're ready to deploy the Next.js app, you'll need to configure the `NEXT_PUBLIC_PARTYKIT_HOST` in your web hosting platform (e.g. Vercel) to point to the deployed PartyKit server address.

```conf
NEXT_PUBLIC_PARTYKIT_HOST=spatial-chat.{your-github-username}.partykit.dev
```

Make sure you've [deployed the PartyKit server](#partykit-deployment) to get the PartyKit host name for your account.
