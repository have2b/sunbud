#!/bin/bash

# Run server app in dev mode
(cd server && bun run dev) &

# Run client app in dev mode
(cd client && bun run dev) &

# Wait for both processes to finish
wait