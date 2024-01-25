<template>
  <v-container fluid>
    <v-overlay v-if="overlay" class="align-center justify-center">
      <v-progress-circular color="primary" indeterminate size="75"></v-progress-circular>
    </v-overlay>
    <v-row cols="12" class="cols" v-for="(i, index) in items" :key="index">
      <v-col cols="12" sm="12" md="3" lg="3">
        <v-card class="mx-auto" max-width="390" color="#86a3c3" elevation="7">
          <v-card-text>
            <p class="display-1">
              {{ i.name }}
            </p>

            <hr />
          </v-card-text>
          <v-card-actions>
            <v-btn text outlined large :href="i.url">
              Visit
            </v-btn>
            <v-btn text outlined large @click="addNote(i.id)">
              Add Note
            </v-btn>
            <v-spacer />
            <v-icon small color="red" @click="deleteSubject(i.id)">
              mdi-delete
            </v-icon>
          </v-card-actions>
        </v-card>
      </v-col>
      <div v-for="(n, index) in notes" :key="index" cols="12">
        <v-col v-if="n.subjectsId == i.id">
          <v-card sm="12" md="3" lg="3" class="mx-auto" max-width="200" color="accent" elevation="7">
            <!-- <v-spacer> -->
            <v-spacer />
            <v-icon small color="red" @click="deleteItem(n.id)">
              mdi-delete
            </v-icon>
            <v-card-text>

              {{ n.note }}
            </v-card-text>
          </v-card>
        </v-col>
      </div>
    </v-row>
    <v-row class="pl-6">
      <v-col>
        <v-dialog v-model="addSubjectBool" persistent max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn color="#20639b" dark v-on="on">Add a Topic</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Note Details</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <!-- <v-text-field
                      label="Subject Name"
                      v-model="subjectName"
                    ></v-text-field> -->
                    <input v-model="subjectName" placeholder="Name" type="text" />
                  </v-col>
                  <v-col cols="12">
                    <!-- <v-text-field
                      label="URL"
                      v-model="subjectURL"
                    ></v-text-field> -->
                    <textarea rows="3" style="border:3px solid #ccc;" v-model="subjectURL" placeholder="URL (if any)"
                      type="text"></textarea>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="addSubjectBool = false">Close</v-btn>
              <v-btn color="blue darken-1" outlined text @click="addSubject">Save</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-col>
    </v-row>
    <v-dialog v-model="AddNoteBool" max-width="600px">
      <v-card>
        <v-card-title>
          <span class="headline">Add a note</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12">
                <!-- <v-text-field
                  label="Note"
                  v-model="toAddNote"
                /> -->
                <textarea rows="8" style="border:3px solid #ccc;" v-model="toAddNote" placeholder="Note"
                  type="text"></textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="AddNoteBool = false">Close</v-btn>
          <v-btn color="blue darken-1" outlined text @click="addNoteToDB()">Save</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script>
import db from "../api/firebaseInit";
import Vue from "vue";
import VueCookies from "vue-cookies";
Vue.use(VueCookies);

export default {
  data() {
    return {
      overlay: false,
      items: [],
      notes: [],
      AddNoteBool: false,
      toAddNote: "",
      toAddNoteId: "",
      subjectName: "",
      subjectURL: "",
      addSubjectBool: false,
    };
  },
  mounted() {
    this.items = [];
    this.notes = [];
    this.mountRun();
  },
  methods: {
    deleteItem(id) {
      this.overlay = true;
      db.collection("notes")
        .doc(id)
        .delete()
        .then(() => {
          this.mountRun();
        });
    },
    deleteSubject(id) {
      this.overlay = true;
      db.collection("notes")
        .where("subjectsId", "==", id)
        .where("id", "==", VueCookies.get("uid"))
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc2) => {
            this.deleteItem(doc2.id)
          })
        })
      db.collection("subjects")
        .doc(id)
        .delete()
        .then(() => {
          this.mountRun();
        });
    },
    addNote(id) {
      this.AddNoteBool = true;
      this.toAddNote = "";
      this.toAddNoteId = id;
    },
    addNoteToDB() {
      if (this.toAddNote == "") {
        return
      }
      this.AddNoteBool = false;
      this.overlay = true;
      // console.log(this.toAddNote);
      let data = {
        note: this.toAddNote,
        subjectsId: this.toAddNoteId,
        id: VueCookies.get("uid"),
      };
      db.collection("notes")
        .add(data)
        .then(() => {
          this.mountRun();
        });
    },
    addSubject() {
      if (this.subjectName == "") {
        return
      }
      this.overlay = true;
      this.addSubjectBool = false;
      // console.log(this.subjectName);
      // console.log(this.subjectURL);
      let data = {
        name: this.subjectName,
        url: this.subjectURL,
        id: VueCookies.get("uid"),
      };
      db.collection("subjects")
        .add(data)
        .then(() => {
          this.subjectName = "";
          this.subjectURL = "";

          this.mountRun();
        });
    },
    mountRun() {
      let itemCount = 1;
      let fetchedItemCount = 0;
      this.items = [];
      this.notes = [];
      this.overlay = true;
      db.collection("subjects")
        .where("id", "==", VueCookies.get("uid"))
        .get()
        .then((snapshot) => {
          itemCount = snapshot.size;
          snapshot.forEach((doc) => {
            // // console.log(doc.data());
            var tempObj = {
              name: doc.data().name,
              url: doc.data().url,
              id: doc.id,
            };
            fetchedItemCount++;
            db.collection("notes")
              .where("subjectsId", "==", doc.id)
              .where("id", "==", VueCookies.get("uid"))
              .get()
              .then((snapshot) => {
                snapshot.forEach((doc2) => {
                  var tempObj = {
                    note: doc2.data().note,
                    subjectsId: doc2.data().subjectsId,
                    id: doc2.id,
                  };
                  this.notes.push(tempObj);
                });
              });
            this.items.push(tempObj);

          });
          if (itemCount == fetchedItemCount) {
            this.overlay = false;
          }
          // console.log(this.items);
        })
        .catch((err) => {
          // eslint-disable-next-line no-unused-vars
          const error = err;
          console.log("Error getting documents", error);
        });

    },
  },
};
</script>
<style>
input[type="text"],
input[type="password"],
textarea,
select {
  width: 100%;
  padding: 12px 20px;
  margin: 8px 0;
  display: inline-block;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-sizing: border-box;
}
</style>
