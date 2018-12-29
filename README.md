SlotJS
======

Circular slot machine built with JavaScript and Emojis!

👉 Try it out at https://danziger.github.io/slotjs.

🔊 Better with sound on!

📱 Android only.


Running It (Development)
------------------------

Take a look at `package.json`, the scripts are self-explanatory.


TODO
----

- Create a `SoundService` class and add sounds.

- Check win.

- Hide (fade) shadows using CSS animations.

- Blur (fade) shadows using the `style` attribute instead of the `shadow-N` classes.

- Keep track of coins.

- Handle code TODOs.

- Improve layout/responsiveness and add title, coins and footer.


Limitations & Possible Improvements
-----------------------------------

- We could rotate the reels container (`.sm__activeReels`) instead of the reels themselves (`.sm__reel`) so that we only need to rotate a single element with JS + another one with a CSS animation (the one that is stopping, if any) at a time. The drawback of this approach is that we have less control over the rotation (with the current approach we could have different speeds and accelerations for each reel) and when we stop a reel, we have to move it outside the container, so we change the DOM.

  We would have to do a performance test with each approach for a specific game configuration (number of reels, global VS individual speed/acceleration...).

- The transition from a stopped animation to start rotating again could be smooth, so that it looks like the reel just continues spinning. Currently it jumps back to the position it was when we stopped it (before the animation) when the animation is removed to start another game.

- A rotation animation could be used instead of manually calculating the rotation, but then when we stop a reel, we would need to find out its angle from a rotation matrix and make sure the transition between the rotation and the stopping animation is smooth.

- The number of "shadow" symbols and size of the symbols and reels is currently not linked to the size of the window. Doing this when the game loads won't be too much of an issue, but dynamically resizing or showing/hiding them if the user resizes the browser while the game is running could impact performance.

  An alternative would be to always render the game with the same dimensions and scale it up or down to match the available space, which would also ensure it always has the same proportions (similarly to what we do to zoom in the result).


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
