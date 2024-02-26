## To Dockerize

- Run docker.
- In the project root, run `docker build -t nestjs-app .` and wait for it to build.
  -After build, run `docker images` on your terminal to view that the `nestjs-app` image is present.
- Then run `docker run --rm -p 3500:3500 nestjs-app` and the project runs on `http://localhost:3500/` you can go and access it there on your localhost
