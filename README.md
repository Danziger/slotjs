<h1 align="center">SlotJS</h1>

<p align="center">
    🎰 Circular slot machine mobile-first SPA built using JavaScript, CSS variables and Emojis!
</p><p align="center">
    🚀 Try it out <a href="https://danziger.github.io/slotjs">here</a>! 🔊 Better with sound & vibration on.
</p><p align="center">
    💩 No IE, Edge or iOS.
</p>

<p align="center">
    <a href="https://danziger.github.io/slotjs" target="_blank">
        <img src="./screenshots/slotjs.png" width="512" />
    </a>
</p>

<hr /><br />


Running It (Development)
------------------------

Take a look at `package.json`, the scripts are self-explanatory.


Deploying to GitHub Pages
-------------------------

To deploy a static application to GitHub Pages we simply need to push the required files to the `gh-pages` branch. In order to easily push the contents of `dist` only, we can use `git worktree`.

First, we need to create the `gh-pages` branch:

    # Create an orphan gh-pages branch:
    git checkout --orphan gh-pages

    # Remove all files from staging:
    git rm -rf .

    # Create an empty commit:
    git commit --allow-empty -m "Init branch."

    # Push:
    git push origin gh-pages


Then, we configure the working tree from `master`:

    # Back to master:
    git checkout master

    # Create a working tree in `dist` and checkout `gh-pages` into it:
    git worktree add dist gh-pages


Lastly, we can build or App and deploy it easily:

    # Build the App:
    npm run build

    # Go into `dist`. Note how the current branch is now `gh-pages` instead of `master`:
    cd dist

    # Commit the changes:
    git commit -am "Release to GitHub pages."

    # And push them:
    git push origin gh-pages


However, keep in mind this will stop working if we delete `dist`. In that case, `git worktree list` will still show the now gone working tree in `dist`. To fix that, we simply do `git worktree prune` and create the working tree again with `git worktree add dist gh-pages`.


TODO
----

- Add title, coins and footer and improve layout in general.

- Keep track of coins.

- Check win.

- Handle code TODOs.

- Create a scripts to deploy to GitHub Pages automatically.

- Tests.


Limitations & Possible Improvements
-----------------------------------

- We could rotate the reels container (`.sm__activeReels`) instead of the reels themselves (`.sm__reel`) so that we only need to rotate a single element with JS + another one with a CSS animation (the one that is stopping, if any) at a time. The drawback of this approach is that we have less control over the rotation (with the current approach we could have different speeds and accelerations for each reel) and when we stop a reel, we have to move it outside the container, so we change the DOM.

  We would have to do a performance test with each approach for a specific game configuration (number of reels, global VS individual speed/acceleration...).

- A rotation animation could be used instead of manually calculating the rotation, but then when we stop a reel, we would need to find out its angle from a rotation matrix and make sure the transition between the rotation and the stopping animation is smooth.


Author
------

<img
    src="https://s.gravatar.com/avatar/ff1de7f1a325c8005379a310949f7f23?s=128"
    alt="Dani Gámez Franco"
    align="left"
/>

Dani Gámez Franco

LinkedIn: https://www.linkedin.com/in/danigamezfranco/

Stack Overflow: https://stackoverflow.com/users/3723993/danziger
