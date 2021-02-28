import firebase from 'firebase';
import store from '../store';
const { Parser } = require('json2csv');

export const dbUtils = {
    methods: {
        /*fireFetch(collection, query, then) {
        if(query != null) { //query fetch
            var splitQuery = query.split(' ');
            firebase
            .firestore()
            .collection(collection)
            .where(splitQuery[0], splitQuery[1], eval("this." + splitQuery[2].substring(1,splitQuery[2].length)))
            .get().then((docs) => {
                then(docs);
            });
        } else { //fetch all
            firebase
            .firestore()
            .collection(collection)
            .get().then((doc) => {
                then(doc);
            });
        }
        },*/
        openModal(context) {
            store.commit('openModal', context);
        },
        closeModal() {
            store.commit('closeModal');
        },
        exportDB(dbContext) {
            var jsonOutput = [];
            //console.clear();
            console.log('exporting database...');
            store.commit('isExporting');
            firebase.firestore().collection('students').get().then((docs) => {
        
                docs.forEach((doc) => {
                    jsonOutput.push(doc.data());
                });
        
                var fields = [];
                var opts = {};
        
                if(dbContext == 'skills_library') {
                    fields = ['area', 'category', 'employee'];
                    opts = { fields };
                } else if(dbContext == 'knowledge_management') {
                    fields = ['area', 'category', 'designation', 'employeeName', 'subcategory'];
                    opts = { fields };
                } else if(dbContext == 'client_knowledge') {
                    fields = ['designation', 'employeeName', 'firm'];
                    opts = { fields };
                } else if(dbContext == 'students') {
                    fields = ['firstName','lastName','email','company','skill','grades', 'tags'];
                    opts = { fields };
                }
        
                //handle CSV parse
        
                try {
                    console.log(opts);
                    console.log(jsonOutput);
                    var parser = new Parser(opts);
                    var csv = parser.parse(jsonOutput);
                    console.log(csv);
        
                    var file = dbContext + '_' + Date.now();
                    
                    //grab current date
        
                    var today = new Date();
                    var dd = String(today.getDate()).padStart(2, '0');
                    var mm = String(today.getMonth() + 1).padStart(2, '0');
                    var yyyy = today.getFullYear();
        
                    var creationDate = mm + '/' + dd + '/' + yyyy;
        
                    //handle file upload
        
                    console.log('handling CSV file upload...');
        
                    const blob = new Blob([csv], {type : 'text/csv'});
        
                    var task = firebase.storage().ref('CSV_data_exports/' + file + '.csv').put(blob);
                    var percentage = 0;
        
                    task.on('state_changed', function progress(snapshot) {
                    //console.clear();
                    percentage = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    console.log(percentage + '%');
                    }, function error(err) {
                    console.error('There was a problem uploading the file:', err);
                    }, function complete() {
                    task.snapshot.ref.getDownloadURL().then(
                        function(downloadURL) {
                        console.log('setting export data in db...');
                        firebase.firestore().collection('exports').add({
                            downloadUrl: downloadURL,
                            timestamp: Date.now(),
                            dateCreated: creationDate,
                            filename: (file + '.csv')
                        });
                        store.commit('isNotExporting');
                        store.commit('exportURL', downloadURL);
                        store.commit('pushNotification', {
                            context: 'Export Status',
                            message: 'Database was successfully exported!',
                            background: '#DDE4ED',
                            action: {
                            name: 'View Exports',
                            fn: () => {
                                console.log('routing to exports page...');
                                store.commit('openModal', 'Exports');
                            }
                            }
                        });
                        store.commit('openModal', 'Notifications');
                        }
                    )
                    })
                    
                } catch (err) {
                    console.error(err);
                    store.commit('pushNotification', { 
                        context: 'Export Status', 
                        message: 'Database failed to export :(',
                        background: 'rgba(255,0,0,0.1)',
                    });
                    store.commit('openModal', 'Notifications');
                }
            });
        },
        addStudent(newStudent) {
            var postData = { ...newStudent, id: store.state.studentCount + 1 }
            firebase.firestore().collection('students').add(postData).then(() => {
                store.commit('pushNotification', {
                    context: 'Student Add',
                    message: 'Successfully added ' + postData.firstName + ' ' + postData.lastName + ' to database!',
                    background: '#DDE4ED',
                    action: {
                        name: 'View',
                        fn: () => {
                            store.commit('closeModal');
                        }
                    }
                });
                console.log('added new student successfully');
                store.commit('openModal', 'Notifications');
                store.commit('logOperation', 'Added new student');
                store.commit('setCurrentStudent', postData.email);
            });
        },
        removeStudent(student) {
            console.log('removing student...', student);
            student = student.substring(1);
            firebase.firestore().collection('students').where('email', '==', student).get().then((docs) => {
                console.log('entered query');
                console.log(docs);
                docs.forEach((doc) => {
                    console.log('deleting ' + doc);
                    doc.ref.delete().then(() => {
                        store.commit('pushNotification', {
                            context: 'Student Removal',
                            message: 'Successfully deleted ' + student + ' from database',
                            backgorund: '#DDE4ED',
                        });
                        store.commit('openModal', 'Notifications')
                        store.commit('logOperation', 'Removed student');
                    });
                });
            }).catch((err) => {
                console.log('oopsie woopsie', err);
            });
        },
        updateStudent(student, newData) {
            console.log('updating student');
            student = student.substring(1);
            firebase.firestore().collection('students').where('email', '==', student).get().then((docs) => {
                docs.forEach((doc) => {
                    doc.ref.update({
                        tags: firebase.firestore.FieldValue.arrayUnion(newData) 
                    });
                });
                store.commit('pushNotification', {
                    context: 'Student Update',
                    message: 'Successfully added tag of "' + newData + '" to ' + student,
                    backgorund: '#DDE4ED',
                });
                store.commit('openModal', 'Notifications');
                store.commit('logOperation', 'Updated student tag');
                store.commit('setCurrentStudent', student);
            });
        }
    }
}