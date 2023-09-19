# sketch-spatial-chat

Multiplayer chat rooms, connected spatially in a simple map, each inhabited with a helpful AI chatbot.

Together the rooms implement a version of Edward De Bono's _Six Thinking Hats_ method for group discussion. (See [Wikipedia](https://en.wikipedia.org/wiki/Six_Thinking_Hats) for more background.)

You can also run the code yourself, and change the room map (and AI prompts) to suit your own needs, and use it on your own or with your team.

![image](/assets/spatial-chat-screenshot.png)

## Experimental!

This app was created during [Matt](https://interconnected.org)'s summer 2023 residency. The purpose is to experiment with multiplayer interactions, and simultaneously see what PartyKit can do. It's called a sketch because it's lightweight and quick, and because we learn something in making it.

## What you'll find here

This app is based on Next.js and PartyKit.

In particular, it also shows how to:

- Use Yjs on the client, with multiple rooms, and with a PartyKit back-end
- Interact with the Yjs document from the server
- Integrate with the OpenAI API, including streaming text responses into the chat.

The room animations make use of Framer Motion.

## Running the app locally

### Environment configuration

This project uses an `.env` file to configure both the PartyKit server and the Next.js app.

For local development, copy `.env.example` file to `.env`, and populate OpenAI API environment variables.

Then run the PartyKit server and run the app:

```sh
npx partykit dev
npm run dev
```

Visit [localhost:3000](http://localhost:3000) in your browser.

## Deployment

### PartyKit

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

## More

There's a blog post about this app on the PartyKit blog. Read: [AI chatbots for Edward De Bono’s Six Thinking Hats](https://blog.partykit.io/posts/thinking-hats-and-spatial-chat)

There are a couple of interaction design niggles that it would be neat to fix next. I'm keeping these points as a personal to-do:

- [ ] Scroll down as NPC messages stream in
- [ ] When users move away, show remaining users the direction of travel
