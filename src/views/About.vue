<template>
<div class="about">
  <div class="me-container">
    <div class="me-photo"></div>
  </div>
  <div class="project-info">
    <h2>Hi! my name's Trent. I'm a front-end developer based in Chicago.</h2>
    <p>This project is a Hatchways.io assessment that involves fetching and manipulating a JSON database, and dynamicically present the data using Vue Components.</p>
    <h3>Process</h3>
    <strong>Part 1</strong>
    <p>Part one of the project involved fetching JSON data from a public API. To accomplish this, I used a custom Node utility to push the JSON data into a Google FIrestore database. I went with Firestore thanks to it's ease of integration with Vue.js, and it's interoperability with hosting, cloud storage, etc.</p>
    <strong>Part 2</strong>
    <p>The front-end of the project was developed with Vue. I chose Vue.js due to it's familiarity, relatively slim boilerplate, and ease of integration with Firebase.</p>
    <p>I used SCSS on the front-end as well, utilizing global style mixins, variables, and nested styles.</p>
    <p>Dashboard mock-ups were designed using Figma.</p>
    <strong>Part 3</strong>
    <p>Search was handled using Array filter() and computed properties.</p>
    <p>Users can dropdown the 'Search Options' to change filters, including search by tag.</p>
    <strong>Part 4</strong>
    <p>Vue.js makes certain complex front-end features like Accordion views, modals, and push notifications a lot of fun to implement(:</p>
    <strong>Challenges</strong>
    <p>There are a few patterns I wanted to avoid, such as manipulating data post-fetch, duplicating functionality between Vuex store and components, using timing functions for hangtime between requests, and direct DOM manipulation.</p>
    <p>These patterns proved to be a challenge regarding performance maintenance, but puzzle piecing the UI was a very fun experience!</p>
    <div class="social-container">
      <a target="_blank" href="https://trentbrew.com"><div class="soc soc0"></div></a>
      <a target="_blank" href="https://github.com/tbrew1023?tab=repositories"><div class="soc soc1"></div></a>
      <a target="_blank" href="https://twitter.com/trent_brew"><div class="soc soc2"></div></a>
      <a target="_blank" href="https://www.instagram.com/trent.brew/"><div class="soc soc3"></div></a>
      <a target="_blank" href="https://www.linkedin.com/in/trent-brew-19a4a7181/"><div class="soc soc4"></div></a>
    </div>
  </div>

</div>
</template>

<style lang="scss" scoped>

.social-container {
  width: max-content;
  justify-content: center;
  align-items: center;
  display: flex;
  justify-content: center;
  align-items: center;

  .soc {
    height: 18px;
    width: 18px;
    margin-right: 24px;
    margin-top: 24px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
    cursor: pointer;
    transition: 200ms;

    &:hover {
      transform: scale(1.1);
    }
  }

  .soc0 {
    background-image: url('https://cdn4.iconfinder.com/data/icons/software-line/32/software-line-02-512.png');
  }

  .soc1 {
    background-image: url('https://image.flaticon.com/icons/png/512/25/25231.png');
  }

  .soc2 {
    background-image: url('https://image.flaticon.com/icons/png/512/39/39379.png');
  }

  .soc3 {
    background-image: url('https://assets.stickpng.com/images/5ecec78673e4440004f09e77.png');
  }

  .soc4 {
    background-image: url('https://image.flaticon.com/icons/png/512/61/61109.png');
  }
}

h2 {
  margin-bottom: 36px;
  color: #4671B1;
}

.about {
  width: 100%;
  height: 100vh;
  position: absolute;
  top: 0px;
  display: flex;
  justify-content: center;
  align-items: center;
  background: white;
}

.me-photo {
  width: 200px;
  height: 200px;
  background-size: 200%;
  background-position: 65% 50%;
  background-repeat: no-repeat;
  background-image: url('https://trentbrew.com/res/ohai.gif');
  position: absolute;
  bottom: 0px;
  left: 64px;
  margin: auto;
}

.project-info {
  width: 900px;
}

</style>
