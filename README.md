# visor-ai-challenge

To run the frontend, as well the backend, go to their respective folders and do: `npm run dev`.

Make sure to have the required environment variables. You can see examples in the .env.example files. For the OpenAi api key and the mongo uri, check github's action variables tab. I added them there for simplicity, but I know that adding them as variables is not the best way to do it.

### Some design choices

- Since the OpenAI api is not free, I limited the size of the input chat input to 100 characters, as well as the number of response tokens from their servers to 100 tokens. You also can only send a new message once you get a response from the server for the previously sent message.
- Ideally we can say its preferable to create a chat app using WebSockets. However, I considered that since we still need to
  do a GET request to the OpenAI servers, and the chat is only 1:1, adding WebSockets would only increase complexity as well as it being harder to scale.
