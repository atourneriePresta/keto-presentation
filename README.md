# KETO PERMISSION SYSTEM

## Introduction
Keto is a permission system made by ori base on [zanzibar](https://research.google/pubs/pub48190/)

It has the benefits to be flexible and scalable.

## Installation
Create a keto.yml files (namespace found on the repo, no docs on [it](https://github.com/ory/keto/blob/a4b41bdb56bf93a1be1a969a0e7fef1670d260eb/contrib/rewrites-example/keto.yaml#L4))

```
version: v0.8.0-alpha.2

serve:
  read:
    host: 0.0.0.0
    port: 4466
  write:
    host: 0.0.0.0
    port: 4467

namespaces:
  location: file://./keto_namespaces/index.ts
```

The namespace file implements the [Ory Permission Language](https://www.ory.sh/docs/keto/#ory-permission-language)

All the namespaces must be in the same file and represent the objects you want create permissions for.

## How it works
You must have [docker-compose](https://docs.docker.com/compose/install/) install on your computer

Create the .env (base on the .env.example if you didn't change the docker-compose)

Start the docker-compose file
```
docker-compose up -d
```

Install the yarn dependancies.
```
yarn install --frozen-lockfile
```

Once it is started, you should be able to use keto. To do so you can launch the script who list you the avalaible command
```
yarn keto --help
```

See the options of a specific command
```
yarn keto relation:create --help
```

All available command in the CLI.md