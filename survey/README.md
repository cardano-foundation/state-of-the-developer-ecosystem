# State of The Developer Ecosystem Survey

## Installation

```
yarn
```

## Configuration

- Cloudflare's turnstile sitekey in [public/js/app.js](./public/js/app.js#L4)
- Survey's questions and answers in [public/js/survey.js](./public/js/survey.js)
- Titles, dates, etc.. in [public/index.html](./public/index.html)

## Development

```
yarn dev
```

## Monitoring

Fetch results and/or answers count via:

```
yarn count
```

or

```
yarn results
```

> [!TIP]
>
> To run those commands against a remote deployed instance, you must first login into Cloudflare:
>
> ```
> yarn wrangler login
> ```
>
> And then, simply append `--remote` to the commands. For example:
>
> ```
> yarn count --remote
> yarn results --remote
> ```

## Deployment

Deploy on Cloudflare by simply pushing the repository. The workers & pages then does its magic. Note that Turnstile secret needs to be configured in the Cloudflare dashboard directly.
