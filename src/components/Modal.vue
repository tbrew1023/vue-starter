<script>
import store from '../store';
import firebase from 'firebase';
import { dbUtils } from '../mixins/dbUtils'

export default {
    name: 'Modal',
    data() {
        return {
            dbExports: [],
            newStudent: {
                firstName: null,
                lastName: null,
                email: null,
                company: null,
                skill: null,
                city: null,
                grades: ['']
            }
        }
    },
    mixins: [dbUtils],
    props: {
        title: {
            type: String,
            default: 'Modal Title'
        }
    },
    mounted() {
        this.fetchExports();
    },
    computed: {
        modalContext() {
            return store.state.modalContext;
        },
        notifications() {
            return store.state.notifications.reverse();
        }
    },
    watch: {
        modalContext() {
            this.fetchExports();
        }
    },
    methods: {
        handleModalExit() {
            store.commit('closeModal');
        },
        handleTimezoneChange(e) {
            store.commit('updateTimezone', e.target.value);
        },
        handleMsgReply() {  
            alert('Handle message reply...');
        },
        handleDismiss(index) {
            store.commit('removeNotification', index);
        },
        fetchExports() {
            firebase.firestore().collection('exports').orderBy('timestamp').get().then((docs) => {
                docs.forEach((doc) => {
                    this.dbExports.push(doc.data());
                })
                this.dbExports.reverse();
            }).catch(() => {
                    console.error('No exports to display');
            });
        },
        allocateScore() {
            this.newStudent.grades.push('');
        },
        handleStudentAdd(newStudent) {
            store.commit('setCurrentStudent', newStudent.email);
            this.addStudent(newStudent);
            this.$forceUpdate();
        }
    }
}
</script>

<template>
<div class="modal-container">
    <div class="modal-top"><h3>{{ modalContext }}</h3><div @click="handleModalExit()" class="modal-exit">X</div></div>
    <div class="modal-bottom">
        <div v-if="modalContext == 'Settings'" class="modal-content-container">
            <ul>
                <li class="settings-item">
                    <h4>Dark Mode</h4>
                    <input type="checkbox" />
                </li>
                <!--li class="settings-item">
                    <h4>Timezone</h4>
                    <select @change="handleTimezoneChange" name="timezones" id="timezones">
                        <option value="PST">PST</option>
                        <option value="CST">CST</option>
                        <option value="EST">EST</option>
                    </select>
                </li-->
            </ul>
        </div>
        <div v-if="modalContext == 'Messages'" class="modal-content-container">
            <ul>
                <li class="message-item">
                    <div class="msg-container">
                        <div class="sender-photo"></div>
                        <div class="msg-content-container">
                            <p class="msg-from">Trent Brew</p>
                            <p class="msg-content">Hello from Chicago!</p>
                        </div>
                    </div>
                    <div @click="handleMsgReply()" class="reply-btn">Reply</div>
                </li>
            </ul>
        </div>
        <div v-if="modalContext == 'Notifications'" class="modal-content-container">
            <ul>
                <li class="no-exports" v-if="notifications.length == 0">No Notifications</li>
                <li v-for="(notification, index) in notifications" :key="index" class="notification-item" :class="(index == 0 ? 'latest' : '' )">
                    <div class="msg-container">
                        <div class="msg-content-container">
                            <p class="msg-from">{{ notification.context }}</p>
                            <p class="msg-content">{{ notification.message }}</p>
                        </div>
                    </div>
                    <div class="export-buttons-container">
                        <div v-if="notification.action" @click="notification.action.fn" class="notification-action">{{ notification.action.name }}</div>
                        <div @click="handleDismiss(index)" class="notification-action remove-btn">Dismiss</div>
                    </div>
                </li>
            </ul>
        </div>
        <div v-if="modalContext == 'Exports'" class="modal-content-container">
            <ul>
                <li class="no-exports" v-if="dbExports.length == 0">No Exports</li>
                <li v-for="(dbExport, index) in dbExports" :key="index" class="notification-item" :class="(index == 0 ? 'latest' : '' )">
                    <div class="msg-container">
                        <div class="notification-photo"></div>
                        <div class="msg-content-container">
                            <p class="msg-from">Created on {{ dbExport.dateCreated }}</p>
                            <p class="msg-content">{{ dbExport.filename }}</p>
                        </div>
                    </div>
                    <div class="export-buttons-container">
                        <a class="export" :href="dbExport.downloadUrl"><div class="download-btn">Download</div></a>
                        <!--div class="remove-btn">Remove</div-->
                    </div>
                </li>
            </ul>
        </div>
        <div v-if="modalContext == 'Add Student'" class="modal-content-container">
            <div class="add-student-container">
                <input v-model="newStudent.firstName" type="text" placeholder="First Name" />
                <input v-model="newStudent.lastName" type="text" placeholder="Last Name" />
                <input v-model="newStudent.email" type="email" placeholder="Email" />
                <input v-model="newStudent.company" type="text" placeholder="Company" />
                <input v-model="newStudent.skill" type="text" placeholder="Skill" />
                <input v-model="newStudent.city" type="text" placeholder="City" />
                <div class="scores-input-container">
                    <input class="score-input" v-for="(score, index) in newStudent.grades" :key="index" v-model="newStudent.grades[index]" type="number" :placeholder="'Grade '+(index+1)" />
                    <div @click="allocateScore" class="add-score">+</div>
                </div>
                <div :class="( !newStudent.firstName || !newStudent.lastName || !newStudent.email || !newStudent.company || !newStudent.skill || !newStudent.city ? 'disabled' : '' )" @click="handleStudentAdd(newStudent)" class="new-student-add">Add Student</div>
            </div>
        </div>
    </div>
</div>
</template>

<style lang="scss" scoped>

.disabled {
    opacity: 0.2;
    cursor: not-allowed !important;
    pointer-events: none;
}

.new-student-add {
    background: #4671B1;
    color: white;
    border-radius: 8px;
    padding: 6px 12px;
    margin-top: 24px;
    cursor: pointer;
    transition: 200ms;

    &:hover {
        background: rgba(#4671B1, 0.1);
        color: #4671B1;
    }
}

.score-input {
    width: 80px;
    margin-left: 12px;
    padding-right: 6px !important;
    padding-left: 12px !important;
}

.add-student-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 100%;

    input {
        border: none;
        background: #f6f6f6;
        margin-top: 24px;
        padding: 12px 24px;
        border-radius: 8px;
    }
}

.scores-input-container {
    display: flex;
    align-items: center;
    justify-content: center;
}

.add-score {
    background: rgba(#4671B1, 0.1);
    color: #4671B1;
    width: 24px;
    height: 24px;
    border-radius: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 24px;
    margin-left: 12px;
    cursor: pointer;
    transition: 200ms;

    &:hover {
        background: #4671B1;
        color: white;
    }
}

@keyframes flash {
    from {
        background: #e0e0e0;
    }
    to {
        background: transparent;
    }
}

.latest {
    background: #DDE4ED;
    animation: flash 2s ease forwards;
}

.no-exports {
    margin-top: 220px;
    opacity: 0.4;
}

.export {
    text-decoration: none;
}

.msg-container {
    display: flex;
    
    .msg-from {
        opacity: 0.4;
        font-size: 12px;
        text-align: left;
        margin: 0px 0px 0px 24px;
    }

    .msg-content {
        margin: 0px 0px 0px 24px;
        text-align: left;
    }
}

.modal-content-container {
    background: white;
    height: 100%;
    width: 100%;
    border-radius: 0px 0px 8px 8px;
    overflow: auto;
    padding-bottom: 24px;

    ul {
        margin: 0px;
        padding: 0px;
        list-style: none;
        display: flex;
        flex-direction: column;
        align-items: center;

        .settings-item, .message-item, .notification-item {
            width: 95%;
            height: 60px;
            margin-top: 18px;
            border-radius: 8px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            //animation: flash 2s ease forwards;
            //cursor: pointer;

            .sender-photo {
                background: orange;
                height: 36px;
                width: 36px;
                margin-left: 18px;
                border-radius: 100%;
                background-size: cover;
                background-repeat: none;
                background-position: center;
                background-image: url('https://github.com/tbrew1023/icommon/blob/master/images/skaterboi.png?raw=true');
            }

            input, select {
                margin-right: 24px;
            }

            h4 {
                margin-left: 24px;
                margin-top: 0px;
                margin-bottom: 0px;
            }
        }
    }
}

.export-buttons-container {
    display: flex;
}

.remove-btn {
    background: #DDE4ED !important;
    color: #4671B1 !important;
}

.reply-btn, .download-btn, .remove-btn, .notification-action {
    background: #4671B1;
    padding: 6px 12px;
    margin-right: 18px;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: 200ms;

    &:hover {
        transform: scale(0.95);
    }
}

.modal-container {
    background: white;
    height: 500px;
    width: 900px;
    border-radius: 8px;
    box-shadow: 0px 12px 24px 24px rgba(0,0,0,0.01);

    .modal-top {
        height: 60px;
        width: 100%;
        border-radius: 8px 8px 0px 0px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        border-bottom: 1px #e0e0e0 solid;

        .modal-exit {
            margin-right: 24px;
            cursor: pointer;
            height: 24px;
            width: 24px;
            transition: 200ms;
            border-radius: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            font-weight: bold;

            &:hover {
                background: black;
                color: white;
            }
        }

        h3 {
            margin-top: 0px;
            margin-bottom: 0px;
            margin-left: 24px;
        }
    }

    .modal-bottom {
        background: white;
        height: 100%;
        width: 100%;
        border-radius: 0px 0px 8px 8px;
    }
}

/* width */
::-webkit-scrollbar {
  width: 8px;
  border-radius: 10px;
}

/* Track */
::-webkit-scrollbar-track { 
  border-radius: 0px 0px 8px 0px;
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