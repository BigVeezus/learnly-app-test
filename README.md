## To Dockerize

- Run docker.
- In the project root, run `docker build -t nestjs-app .` and wait for it to build.
  -After build, run `docker images` on your terminal to view that the `nestjs-app` image is present.
- Then run `docker run --rm -p 3500:3500 nestjs-app` and the project runs on `http://localhost:3500/` you can go and access it there on your localhost

## To run locally

- Make sure you have node installed, I used node 20.10.0 for this project

- run `npm install`

- run `npm run start` to view project on `http://localhost:3500/`

## Documentation

- Documentation of this project and how to use the api can be found at https://documenter.getpostman.com/view/21609093/2sA2rDwgEw

NOTE: The `.env` was exposed in this project purposely so tester can interact with the database
