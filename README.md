# Haneke Design Interface CLI

This is a CLI tool that generates TypeScript types, Superstruct validators and type guards from an OpenAPI schema.

## How to use:

```bash
hdicli -u https://example.com/openapi.json -o ./output -t types.ts -s superstruct.ts -g guards.ts
```

## Options

| Option        | Alias | Description                                                              | Optional? |
| ------------- | ----- | ------------------------------------------------------------------------ | --------- |
| --url         | -u    | The URL to the OpenAPI schema.                                           | ❌        |
| --outdir      | -o    | The output directory for the generated files (Default: './')             | ✅        |
| --types       | -t    | The name for the generated types file. (Default: 'types.ts')             | ✅        |
| --superstruct | -s    | The name for the generated superstruct file. (Default: 'superstruct.ts') | ✅        |
| --guards      | -g    | The name for the generated guards file. (Default: 'guards.ts')           | ✅        |
| --help        | -h    | Show help                                                                | --        |
| --version     | -v    | Show version number                                                      | --        |

## Installation & Usage

### Install using npm:

```bash
npm install -g hdicli
```

```bash
hdicli -u https://example.com/openapi.json -o ./output -t types.ts -s superstruct.ts -g guards.ts
```

### Using `npx`:

```bash
npx hdicli -u https://example.com/openapi.json -o ./output -t types.ts -s superstruct.ts -g guards.ts
```

#### This will generate three files in the output directory:

- `types.ts`: Contains TypeScript types generated from the OpenAPI schema.
- `superstruct.ts`: Contains Superstruct validators generated from the OpenAPI schema.
- `guards.ts`: Contains type guards generated from the OpenAPI schema.
