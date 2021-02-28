<template>
  <div class="home">
    
    <!--div class="banner-container div2"><Banner title="Welcome!" :subtitle="'Today is ' + datetime" primaryColor="#4671B1" /></div-->
  </div>
</template>

<script>
// @ts-nocheck
//import Banner from '@/components/Banner.vue';
//import CircleProgress from '@/components/CircleProgress.vue';
//import DataList from '@/components/DataList.vue';
import firebase from 'firebase';
import store from '../store';

export default {
  name: 'Home',
  components: {
    //Banner,
    //CircleProgress,
    //DataList,
  },
  data() {
    return {
      datetime: null,
      students: [],
      allGrades: [],
      totalAverage: 0,
      studentCount: 0
    }
  },
  mounted() {
    this.setDate();
    this.fetchStudents();
  },
  computed: { 
    dbOperations() {
      return store.state.dbOperations;
    },
    getCurrentStudent() {
      return store.state.currentStudent;
    }
  },
  watch: {
    dbOperations() {
      setTimeout(() => {
        this.students = [];
        this.fetchStudents();
        this.scrollToContext();
      }, 1000);
    }
  },
  methods: {
    setDate() {
      var today = new Date();
      var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0');
      var yyyy = today.getFullYear();

      var lastOfDay = dd.substring(dd.length-1,dd.length);
      var secondLastOfDay = dd.substring(dd.length-2,dd.length-1);
      today = months[parseInt(mm) - 1] + ' ' + dd + ( lastOfDay == 1 && secondLastOfDay != 1 ? 'st' : ( lastOfDay == 2 && secondLastOfDay != 1 ? 'nd' : ( lastOfDay == 3 && secondLastOfDay != 1 ? 'rd' : 'th' ) ) ) + ', ' + yyyy;

      this.datetime = today;
    },
    async fetchStudents() {
      await firebase.firestore().collection('students').get().then((docs) => {
        docs.forEach((doc) => {
          this.studentCount++;
          var preData = doc.data();
          var postData = { 
            ...preData, 
            name: preData.firstName + ' ' + preData.lastName,
            average: this.indiAverage(preData).toFixed(3),
          }
          if(!preData.tags) {
            postData = {
              ...postData,
              tags: []
            }
          }
          this.students.push(postData);
          for(let i = 0; i < doc.data().grades.length; i++) {
            this.allGrades.push(doc.data().grades[i]);
          }
        });
        store.commit('studentCount', this.studentCount);
        this.getAverage();
      });
    },
    getAverage() {
      var sum = 0;
      for(let i = 0; i < this.allGrades.length; i++) {
        sum += parseInt(this.allGrades[i]);
      }
      this.totalAverage = parseInt((sum / this.allGrades.length).toFixed(0));
    },
    indiAverage(student) {
      var sum = 0;
      for(let i = 0; i < student.grades.length; i++) {
        sum += parseInt(student.grades[i]);
      }
      return sum / student.grades.length;
    },
    scrollToContext() {
      var context = this.getCurrentStudent;
      setTimeout(() => {
        console.clear();
        var contextElement = document.getElementById(context);
        var topPos = contextElement.offsetTop;
        document.getElementById('scrollable-inner').scrollTop = topPos - 526;
      }, 2300).catch((err) => {
        console.log('no scroll context: ', err);
      });
    }
  }
}
</script>

<style lang="scss" scoped>
@import '../assets/styles/global';

$headHeight: 300px;

.home {
  height: calc(100vh - 80px);
  width: 100%;
  background: #eee;
  margin-top: 80px;
  box-sizing: border-box;
  padding: 36px;
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  grid-template-rows: repeat(12, 1fr);
  grid-column-gap: 36px;
  grid-row-gap: 36px;
}

.data-container {
  height: 100%;
  width: 100%;
  border-radius: $rad;
}

.banner-container {
  background-image: url('https://github.com/tbrew1023/icommon/blob/master/images/banner-small.png?raw=true');
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
  height: 100%;
  width: 100%;
  margin-right: $gap;
  border-radius: $rad;

}

.progress-circle-container {
  background: $colorMainLight;
  height: 100%;
  width: 100%;
  border-radius: $rad;
  display: flex;
  justify-content: center;
  align-items: center;
}

.circle-progress {
  transform: scale(0.6);
}

.div1 { grid-area: 1 / 10 / 5 / 13; }
.div2 { grid-area: 1 / 1 / 5 / 10; }
.div3 { grid-area: 5 / 1 / 13 / 13; }

</style>
