# huensch
Michael Huensch's Personal Website: built locally using ghost and hosted statically online.

## Setup

### Get Ghost Running Locally
Getting ghost running locally from this project is a bit of a pain.  The easiest way to do this is a bit "hacky", but it works for now.


shopt -s dotglob && mkdir ../huenschtemp && mv  -v ./* ../huenschtemp
ghost install local
shopt -s dotglob && mv -v ../huenschtemp/* . && rm -fr huenschtemp
[ignore any errors]
ghost restart

Michael Huensch
michael@huensch.com
gtSh){Fz=Mxg7W~/




1. Stop ghost if it's running
```
ghost stop
```

1. Move any content in the folder you want to work from into a temp directory

1. Install the latest cli
```
npm install ghost-cli@latest -g
```

1. Point the ghost config at this folder
```
open -t ~/.ghost/config
```
Add or edit an entry to include this folder.  For instance
``` JSON
{
  "instances": {
    "ghost-local": {
      "cwd": "/Users/someuser/another instance"
    },
    "ghost-local-1": {
      "cwd": "/Users/someuser/huensch"
    }
  }
}
```


## References
* [Hosting a Ghost Blog in GitHub](https://zzamboni.github.io/test-ghost-blog/hosting-a-ghost-blog-in-github-the-easier-way/index.html)