<template>
    <div class="students-container">
        <!--div class="search-container">
            <input v-model="search" type="text" />
        </div-->
        <ul>
            <li v-for="(student, index) in students" :key="index" class="student-item">
                <div class="pic" :style="'background-image:url('+student.pic+')'"></div>
                <div class="info-container">
                    <h1>{{ student.firstName + ' ' + student.lastName }}</h1>
                    <p>Email: {{ student.email }}</p>
                    <p>Company: {{ student.company }}</p>
                    <p>Skill: {{ student.skill }}</p>
                    <p>Average: {{ getAverage(student.grades) }}%</p>
                </div>
            </li>
        </ul>
    </div>
</template>

<script>
import firebase from 'firebase';

export default {
    name: 'Original',
    data() {
        return {
            students: []
        }
    },
    mounted() {
        this.fetchStudents();
    },
    computed: {
        
    },
    methods: {
        async fetchStudents() {
            await firebase.firestore().collection('students').get().then((docs) => {
                docs.forEach((doc) => {
                    this.students.push(doc.data());
                });
            });
        },
        getAverage(grades) {
            var sum = 0;
            grades.forEach((grade) => {
                sum += parseInt(grade);
            });
            return sum / grades.length;
        }
    }
}
</script>

<style lang="scss" scoped>

.students-container {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
    width: 100%;
    background: #eee;
}

ul {
    height: 500px;
    width: 700px;
    overflow: auto;
    background: white;
    border-radius: 8px;
    overflow: auto;
    padding: 0px 0px 0px 8px;
    margin: 0px;

    li {
        border-bottom: 1px solid #e0e0e0;
    }
}

.student-item {
    display: flex;
    justify-content: left;
    align-items: center;

    .pic {
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
        height: 120px;
        width: 120px;
        border-radius: 100%;
        border: 1px solid #e0e0e0;
        margin-left: 24px;
    }

    .info-container {
        display: block;
        text-align: left;
        margin-left: 36px;
    }
}

/* width */
::-webkit-scrollbar {
  width: 8px;
  border-radius: 10px;
}

/* Track */
::-webkit-scrollbar-track { 
  border-radius: 0px 8px 8px 0px;
  background: #ffffff;
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