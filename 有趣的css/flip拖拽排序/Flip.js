const Flip = (function () {
  class FlipDom {
    constructor(dom, duration = 0.5) {
      this.dom = dom;
      this.transition =
        typeof duration === 'number' ? `${duration}s` : duration;
      this.firstPosition = {
        x: null,
        y: null,
      };
      this.isPlaying = false;
      this.transitionEndHandler = () => {
        this.isPlaying = false;
        this.recordFirst();
      };
    }

    getDomPosition() {
      const rect = this.dom.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top,
      };
    }

    recordFirst(firstPosition) {
      if (!firstPosition) {
        firstPosition = this.getDomPosition();
      }
      this.firstPosition.x = firstPosition.x;
      this.firstPosition.y = firstPosition.y;
    }

    *play() {
      if (!this.isPlaying) {
        this.dom.style.transition = 'none';
        const lastPosition = this.getDomPosition();
        const dis = {
          x: lastPosition.x - this.firstPosition.x,
          y: lastPosition.y - this.firstPosition.y,
        };
        if (!dis.x && !dis.y) {
          return;
        }
        this.dom.style.transform = `translate(${-dis.x}px, ${-dis.y}px)`;
        yield 'moveToFirst';
        this.isPlaying = true;
      }

      this.dom.style.transition = this.transition;
      this.dom.style.transform = `none`;
      this.dom.removeEventListener('transitionend', this.transitionEndHandler);
      this.dom.addEventListener('transitionend', this.transitionEndHandler);
    }
  }

  class Flip {
    constructor(doms, duration = 0.5) {
      this.flipDoms = [...doms].map((it) => new FlipDom(it, duration));
      this.flipDoms = new Set(this.flipDoms);
      this.duration = duration;
      this.flipDoms.forEach((it) => it.recordFirst());
    }

    addDom(dom, firstPosition) {
      const flipDom = new FlipDom(dom, this.duration);
      this.flipDoms.add(flipDom);
      flipDom.recordFirst(firstPosition);
    }

    play() {
      let gs = [...this.flipDoms]
        .map((it) => {
          const generator = it.play();
          return {
            generator,
            iteratorResult: generator.next(),
          };
        })
        .filter((g) => !g.iteratorResult.done);

      while (gs.length > 0) {
        document.body.clientWidth;
        gs = gs
          .map((g) => {
            g.iteratorResult = g.generator.next();
            return g;
          })
          .filter((g) => !g.iteratorResult.done);
      }
    }
  }

  return Flip;
})();
