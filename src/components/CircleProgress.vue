<template>
<div class="pie-options">
  <!-- single value -->
  <div class="circle-progress cp" :style="{width:size+'px',height:size+'px'}" :data-pct="animatedProgress + '%'">

    <h4>{{ title }}</h4>

    <svg class="pie" :width="size" :height="size" :viewPort="'0 0 '+ size + ' ' + size" version="1.1" xmlns="http://www.w3.org/2000/svg">
      
      <circle 
      class="ring"
      :stroke="ringColor"
      :r="r"
      :cx="size/2"
      :cy="size/2"
      :stroke-width="strokeWidth"
      fill="none"
      >
      </circle>

      <circle 
      id="p"
      class="progress_circle progressSingle" 
      :stroke="progressColor" 
      :r="r" 
      :cx="size/2" 
      :cy="size/2" 
      :stroke-width="strokeWidth"
      :stroke-dasharray="dasharray" 
      :stroke-dashoffset="dashoffset"
      fill="none">
      </circle>

    </svg>
  </div>
</div>
</template>

<script>
// @ts-nocheck
import store from '../store'

export default {
  name: "CircleProgress",
  data() {
    return {
      animatedProgress: 0,
    };
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    score: {
      type: Boolean,
      default: false
    },
    size: {
      type: Number,
      default: 300
    },
    percentage: {
      type: Number,
      default: 0,
      validator: val => {
        return val <= 100;
      }
    },
    total: {
      type: Number,
      default: 0
    },
    strokeWidth: {
      type: Number,
      default: 4
    },
    ringColor: {
      type: String,
      default: "#f7f7f7"
    },
    progressColor: {
      type: String,
      default: "#ff0000"
    },
    showNumber: {
      type: Boolean,
      default: true
    }
  },
  computed: {
    dark() {
      return store.state.dark;
    },
    r() {
      return this.size / 2 - this.strokeWidth / 2;
    },
    dasharray() {
      return 2 * Math.PI * this.r;
    },
    dashoffset() {
      return (this.dasharray * (1 - this.percentage / 100));
    },
    progressNumber() {
      return this.showNumber && parseInt(this.percentTotal);
    },
    percentTotal() {
      return this.percentage;
    }
  },
  created() {
    //console.log('circle progress created!');
  },
  mounted() {
    //console.log('total percentage',  this.percentage);
    //console.log('p', document.getElementById('p').getTotalLength());
    setTimeout(() => {
    //this.reorder();
    if(this.percentTotal != 0 || this.percentTotal) {
        this.animatePercent();
    }
    else {
        this.animatedProgress = this.percentTotal;
    }
    }, 1000); //hang time for async
  },
  methods: {
    animatePercent() {
      var self = this;
      var count = 0;
      var up = setInterval(() => {
        this.animatedProgress = count;
        count++;
        //console.log("percentage: " + this.percentTotal);
      }, 1500 / this.percentTotal);
      setTimeout(() => {
        clearInterval(up);
        self.animatedProgress = this.percentTotal;
        //console.log(this.percentage);
      }, 1500);
    }
  }
};
</script>

<style lang="scss" scoped>

.pie-options {
    display: flex;
    justify-content: center;
    align-items: center;
}

h4 {
  position: absolute;
  padding-top: 88px;
  color: #3B5A89;
  font-weight: normal;
  font-size: 18px;
}

.cp {
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle-progress, .circle-progress-snap {
  position: relative;
  text-align: center;
}
.circle-progress:after, .circle-progress-snap:after {
  content: attr(data-pct);
  font-size:48px;
  font-weight: 900;
  width:100%;
  position: absolute;
  top: 46%;
  left: 50%;
  transform: translate3d(-50%, -50%, 0);
  font-family: monospace;
  color: #3B5A89;
}
.circle-progress, .circle-progress-snap {
  svg {
    transform: rotate(-90deg);
  }
}
.circle-progress .progress_circle {
  stroke-linecap: round;
  transition: stroke-dashoffset 2s ease;
  //transition-delay: 600ms;
}

.circle-progress-snap {
  stroke-linecap: round;
}

use {
  transition: 5s ease;
}

.circle-percentage {
  font-size: 75%;
}

circle {
  stroke-linecap: round;
}

.pie {
  transform: rotate(0deg) !important;
}

#p {
  opacity: 0;
  animation: score-boi 2s ease forwards 1s;
}

@keyframes score-boi {
  0% {
    stroke-dashoffset: 918;
  }
  100% {
    opacity: 1;
  }
}

</style>