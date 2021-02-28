<template>
  <div class="datalist-container">
    <div class="list-head-container">
      <div class="head-left"><h1>{{ title }}</h1><div class="add-button" @click="openModal('Add Student')"><div class="add-icon"></div>Add</div></div>
      <div class="head-right">
        <div class="search-container">
          <input @click="collapseLast" v-model="search"  placeholder="Search" type="text" name="search" id="search"/>
          <div class="search-icon"></div>
        </div>
        <div class="filter-button">
          <div class="order-icon"></div>
          <select class="filter-button" @change="updateSearchFilter" name="search-filter" id="search-filter">
              <option value="name">Search by name</option>
              <option value="email">Search by email</option>
              <option value="company">Search by company</option>
              <option value="skill">Search by skill</option>
              <option value="city">Search by city</option>
              <option value="tag">Search by tag</option>
            </select>
        </div>
        <div @click="exportDB('students')" class="export-button"><div class="export-icon"></div>{{ ( isExporting ? 'Exporting...' : 'Export' ) }}</div>
      </div>
    </div>

    <div class="list-top" :style="(!filteredItems.length == 0  ? 'opacity: 1' : 'opacity: 0' )">
      <div class="col pre-col"><span>#</span></div>
      <div v-for="(column, index) in columnTitles" :key="index" class="col"><span>{{ column }}</span></div>
    </div>

    <div class="list-contents-container" id="scrollable-inner">
      <div v-if="filteredItems.length == 0" class="no-results"><h4>No Results</h4></div>
      <div class="services-container">
        <div class="services-container-right">
          <ul>
            <li 
            class="list-item"
            :style="'background:'+( index1 % 2 == 0 ? '#f9f9f9' : '#ffffff' )"
            v-for="(i, index1) in filteredItems" 
            v-bind:key="index1" 
            :id="i.email"
            :class="(index1 != 0 ? '' : 'first-service')">
              <div :id="'item'+index1" @click="dropdown" class="inner-columns-container">
                <div class="pre-key-col"><span>{{ index1+1 }}</span></div>
                <div v-for="(colKey, index2) in columnKeys" :key="index2" class="key-col">
                  <span :class="( index2 == columnKeys.length - 1 ? 'cozy' : '')">
                    <div :style="'background-image:url('+ filteredItems[index1].pic +')'" :class="(index2 == 0 ? 'profile-photo' : '' )"></div>
                    {{ filteredItems[index1][colKey] }}<span v-if="index2 == columnKeys.length - 1" class="percent">%</span>
                  </span>
                  <ProgressBar v-if="graphable && index2 == columnKeys.length - 1" :value="parseInt(getAverage(i))" />
                </div>
              </div>
              <div class="droppable">
                <div class="tags-container">
                    <div class="test-scores-container">
                        <b style="font-weight: normal"><strong>Grades </strong> {{ filteredItems[index1].grades.join('%, ') }}%</b>
                        <div style="margin-left:32px"></div>
                        <b style="font-weight: normal"><strong>Tags </strong> {{ ( !filteredItems[index1].tags || filteredItems[index1].tags.length == 0 ? 'None' : filteredItems[index1].tags.join(', ')) }}</b>
                    </div>
                </div>
                <div class="bottom-droppable">
                  <div class="droppable-actions-container">
                    <div v-if="dropActive" class="drop-btn1"><input v-model="newTag" type="text" placeholder="Add Tag" /></div>
                    <div v-if="dropActive" @click="updateStudent(currentStudent, newTag)" :class="( !newTag ? 'disabled' : '' )" class="droppable-btn drop-btn2">Submit</div>
                  </div>
                  <div v-if="dropActive" @click="removeStudent(currentStudent)" class="remove-student-btn">Remove Student</div>
                </div>
              </div>
            </li>.
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import ProgressBar from '@/components/ProgressBar.vue';
import { dbUtils } from '../mixins/dbUtils';
import store from '../store';

export default {
  name: 'DataList',
  components: {
    ProgressBar
  },
  mixins: [dbUtils],
  props: {
    title: {
      type: String,
      default: 'List Title'
    },
    test: {
      type: Boolean,
      default: false
    },
    expandable: {
      type: Boolean,
      default: false
    },
    data: Array,
    columnTitles: Array,
    columnKeys: Array,
    graphable: Boolean
  },
  data() {
    return {
      droppable: [],
      items: [],
      search: '',
      activeDrop: null,
      lastDropped: null,
      dropActive: false,
      currentStudent: null,
      searchFilter: 'firstName',
      newTag: null
    }
  },
  mounted() {

  },
  computed: {
    filteredItems() {
      if(this.searchFilter != 'tag') {
        return this.data.filter((item) => {
            return item[this.searchFilter].toLowerCase().match(this.search.toLowerCase());
        });
      } else {
        return this.data.filter((item) => {
            return item.tags.join('').toLowerCase().match(this.search.toLowerCase());
        })
      }
    },
    isExporting() {
        return store.state.isExporting;
    }
  },
  methods: {
    getAverage(student) {
        var sum = 0;
        for(let i = 0; i < student.grades.length; i++) {
            sum += parseInt(student.grades[i]);
        }
        return (sum / student.grades.length).toFixed(3);
    },
    handleExport() {
      this.$emit('exportList');
    },
    dropdown(event) {
      this.currentStudent = event.currentTarget.childNodes[3].childNodes[0].childNodes[1].textContent;

      var currentDroppable = event.currentTarget.nextSibling;
      //on first drop
      !this.lastDropped || currentDroppable.classList.contains('dropped') ? console.log('hang time') : this.lastDropped.classList.remove('dropped');
      //drop toggle
      currentDroppable.classList.contains('dropped') ? currentDroppable.classList.remove('dropped') : currentDroppable.classList.add('dropped');
      if(this.lastDropped == currentDroppable) {
        this.dropActive = !this.dropActive;
      } else {
        this.dropActive = false;
        setTimeout(() => {
          this.dropActive = true;
        }, 100);
      }
      //queue last dropped
      this.lastDropped = currentDroppable;
      this.$forceUpdate();
    },
    collapseLast() {
      !this.lastDropped ? console.log('nothing to collapse') : this.lastDropped.classList.remove('dropped');
    },
    updateSearchFilter(e) {
      this.searchFilter = e.target.value;
    }
  }
}
</script>

<style scoped lang="scss">

.test-scores-container {
    //width: max-content !important;
    display: flex !important;
    justify-content: center !important;
    align-items: center !important;

    strong {
        margin: 0px 32px 0px 0px !important;
    }

    b {
        margin-left: 0px 12px 24px 12px !important;
        display: flex;
        align-items: center;
    }
}

.tags-container {
    display: flex;
    text-align: center;
    justify-content: center;
}

.pill {
    //background: #ddd;
    border-radius: 12px;
    padding: 0px;
    margin: 0px 3px 0px 3px !important;
}

.profile-photo {
    background: #e0e0e0;
    height: 36px;
    width: 36px;
    border-radius: 100%;
    margin-right: 24px;
    margin-left: -18px;
    background-size: contain;
    background-position: center;
    background-repeat: no-repeat;
}

.cozy {
    //background: red;
    width: 70px !important;
}

.percent {
    margin: 0px !important;
}

.disabled {
    background: rgba(black,0.1) !important;
    color: rgba(black, 0.2) !important;
    cursor: not-allowed !important;
    pointer-events: none;
}

.droppable-actions-container {
  display: flex;
  margin-left: 18px;
}

.remove-student-btn {
  background: rgba(red, 0.1);
  color: red;
  padding: 6px 12px;
  border-radius: 8px;
  margin-right: 18px;
  animation: flyin 200ms ease forwards 300ms;
  cursor: pointer;
  transition: 200ms !important;
  opacity: 0;
  transform: scale(0.6);
  pointer-events: all;

  &:hover {
    background: rgba(red, 0.5);
    color: white;
  }
}

.drop-btn1 {
  opacity: 0;
  transform: scale(0.6);
  animation: flyin 200ms ease forwards 100ms;
  margin-right: 12px;

  input {
    padding: 8px 8px 8px 12px;
    border: none;
    border-radius: 8px;
    width: 200px;

    &:focus {
      outline: none;
    }
  }
}

.drop-btn2 {
  opacity: 0;
  transform: scale(0.6);
  animation: flyin 200ms ease forwards 200ms;
  transition: 200ms !important;
}

@keyframes flyin {
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.inner-columns-container {
  display: flex;
  width: 100%;
  flex-basis: auto;
  height: inherit;
  cursor: pointer;
}

.add-icon {
  //background-size: 70%;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("https://raw.githubusercontent.com/tbrew1023/icommon/c8e31784a53239d9469dc8625b184adbf7b941e3/blue-plus.svg");
  height: 24px;
  width: 24px;
  //margin-left: -36px;
}

.search-icon {
  background-size: contain;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("https://raw.githubusercontent.com/tbrew1023/icommon/c5bf1076cb9bf0a5f060b81624b53f01b4953a71/search.svg");
  opacity: 0.2;
  height: 24px;
  width: 24px;
  margin-left: -36px;
}

.head-left {
  display: flex;
  align-items: center;

  h1 {
    font-size: 24px;
    font-weight: bold;
    margin-top: 0px;
    margin-bottom: 0px;
    margin-right: 12px;
  }
}

.head-right {
  display: flex;
}

.list-head-container {
  height: 36px;
  //background: red;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.list-contents-container {
  height: 75%;
  overflow: auto;
  border-radius: 0px 0px 8px 8px;
}

.key-col {
  //border: 1px black solid;
  width: 100%;
  height: inherit;
  display: flex;
  align-items: center;
  padding: 24px 0px 24px 0px;
  color: black;
  justify-content: flex-start;

  span {
    font-size: 12px;
    opacity: 1;
    text-align: left;
    margin-left: 36px;
  }
}

.pre-col, .pre-key-col {
  //border: 1px black solid;
  width: 20% !important;
  height: inherit;
  display: flex;
  justify-content: left;
  align-items: center;

  span {
    margin-left: 32px;
    font-size: 12px;
    text-transform: uppercase;
    opacity: 0.4;
  }  
}

.col {
  //border: 1px black solid;
  width: 100%;
  height: inherit;
  display: flex;
  justify-content: left;
  align-items: center;

  span {
    margin-left: 24px;
    font-size: 12px;
    text-transform: uppercase;
    opacity: 0.4;
  }
}

.list-top {
  background: white;
  width: 100%;
  height: 63px;
  margin-top: 24px;
  border-radius: 8px 8px 0px 0px;
  border-bottom: #eee 1px solid;
  display: flex;
  align-items: center;
  //box-shadow: 0px 36px 36px -24px black;
}

.no-results {
  margin-top: 120px;
  font-size: 14px;
  text-align: center;
}

.search-container {
  display: flex;
  background: transparent;
  //border-radius: 12px;
  width: auto;
  //background: green;
  align-items: center;
  justify-content: center;
  margin-right: 24px;

  #search {
    width: 600px;
    border: none;
    padding: 12px 0px 12px 24px;
    text-align: left;
    border-radius: 8px;
    font-size: 14px;
    
    &:focus {
      outline: none;
    }
  }
}

.add-button {
  width: 72px !important;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.export-button {
  background: rgba(70,113,177,0.3) !important;
  width: 96px !important;
  margin-right: 0px !important;
}

.filter-button {
  transform: scale(1) !important;
  width: max-content !important;
  outline-style: none;
  box-shadow: none;
  border-color: transparent;
}

.filter-button, .export-button, .add-button {
  font-weight: bold;
  background: white;
  border-radius: 8px;
  height: 36px;
  width: 160px;
  padding: 3px 6px;
  margin-right: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: 200ms;
  cursor: pointer;
  color: black;
  margin-left: 12px;
  font-size: 12px;
  color: #4671B1;

  .export-icon {
    background-image: url('https://github.com/tbrew1023/icommon/blob/master/blue-export.png?raw=true');
    background-position: center;
    background-size: 80%;
    background-repeat: no-repeat;
    width: 18px;
    height: 18px;
    margin-right: 6px;
  }

  .order-icon {
    background-image: url('https://raw.githubusercontent.com/tbrew1023/icommon/c8e31784a53239d9469dc8625b184adbf7b941e3/blue-filter.svg');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
    width: 18px;
    height: 18px;
    margin-right: -12px;
    margin-left: 12px;
  }

  &:hover {
    transform: scale(0.95);
  }
}

.list-item {
  display: block !important;
  background: #f9f9f9;
  margin: 0px;
}

#item1 {
  border: none !important;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  //display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}

.datalist-container {
  width: 100%;
  height: 100%;
}

.services-container {

  .service-icon {
    //background: black;
    //opacity: 0.2;
    display: none;
    height: 32px;
    width: 32px;
    margin-right: 24px;
    background-repeat: no-repeat;
    background-size: contain;
    background-position: center;
  }

  ul {
    margin: 0px;
    padding: 0px;
    list-style: none;

    .droppable {
      width: 100%;
      height: 0px !important;
      color: black !important;
      transition: 300ms;
      text-align: left;
      padding-top: 0px;
      margin: 0px;
      opacity: 0;
      flex-direction: column;
      z-index: -1;
      pointer-events: none;

      strong {
        margin-top: 6px;
        display: none;
        text-align: center
      }

      .bottom-droppable {
        //display: none !important;
        //background: red;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;

        .remove-student-btn {
          display: none;
        }

        .droppable-btn {
          background: #4671B1;
          height: 30px;
          width: 100px;
          margin-right: 12px;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          border-radius: 8px;
          cursor: pointer;
          transition: 200ms !important;

          &:hover {
            background: rgba(#4671B1,0.3);
            color: #4671B1;
          }
        }
      }
    }

    .dropped {
      background: #e9e9e9 !important;
      height: 100px !important;
      transition: 300ms;
      opacity: 1 !important;
      padding-top: 12px;
      pointer-events: all;
      display: flex;
      margin: 0px;

      .remove-student-btn {
        display: block !important;

        &:hover {
          transform: scale(0.95);
        }
      }

      strong {
        text-align: center;
        display: block;
      }
      
      span {
        margin-left: 24px;
      }
    }
    
    li {
      //border: 1px solid black;
      //border-top: 1px #e0e0e0 solid;
      //display: flex;
      //justify-content: center;
      //align-items: center;

      span {
        //color: red;
        font-size: 14px;
        //text-transform: uppercase;
        //font-weight: bold;
        //width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        transition: 100ms;

        b {
          margin-right: 24px;
          height: 12px;
          width: 12px;
          background-position: center;
          background-repeat: no-repeat;
          background-size: contain;
          //background-image: url('https://github.com/tbrew1023/icommon/blob/master/arrow-down.png?raw=true');
        }
      }

      &:hover {
        span {
          b {
            color: black !important;
          }
        }
      }
    }
  }

  .service-par {
    font-size: 14px;
  }

  h1 {
    font-size: 52px;
    font-weight: bold;
    margin-top: 0px;
    margin-bottom: 0px;
  }

  p {
    width: 85%;
  }

}

.right {
  transform: rotate(180deg);
  transition: 300ms;
}

.up {
  transform: rotate(0deg);
  transition: 300ms;
}

/* width */
::-webkit-scrollbar {
  width: 8px;
  border-radius: 10px;
}

/* Track */
::-webkit-scrollbar-track { 
  border-radius: 0px 0px 8px 0px;
  background: #f6f6f6;
}
 
/* Handle */
::-webkit-scrollbar-thumb {
  background: #e0e0e0; 
  border-radius: 10px;
}

/* Handle on hover */
::-webkit-scrollbar-thumb:hover {
  //background: #gray; 
}
</style>
