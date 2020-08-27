<template>
  <v-container fluid>
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
          <v-card
            sm="12"
            md="3"
            lg="3"
            class="mx-auto"
            max-width="200"
            color="accent"
            elevation="7"
          >
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
            <v-btn color="#20639b" dark v-on="on">Add a subject</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Subject Details</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12">
                    <!-- <v-text-field
                      label="Subject Name"
                      v-model="subjectName"
                    ></v-text-field> -->
                    <input
                      v-model="subjectName"
                      placeholder="Subject Name"
                      type="text"
                    />
                  </v-col>
                  <v-col cols="12">
                    <!-- <v-text-field
                      label="URL"
                      v-model="subjectURL"
                    ></v-text-field> -->
                    <input v-model="subjectURL" placeholder="URL" type="text" />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="addSubjectBool = false"
                >Close</v-btn
              >
              <v-btn color="blue darken-1" text @click="addSubject">Save</v-btn>
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
                <input v-model="toAddNote" placeholder="Note" type="text" />
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue darken-1" text @click="AddNoteBool = false"
            >Close</v-btn
          >
          <v-btn color="blue darken-1" text @click="addNoteToDB()">Save</v-btn>
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
      console.log(id);
      db.collection("notes")
        .doc(id)
        .delete()
        .then(() => {
          this.mountRun();
        });
    },
    deleteSubject(id) {
      console.log(id);
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
          this.AddNoteBool = false;
        });
    },
    addSubject() {
      // console.log(this.subjectName);
      // console.log(this.subjectURL);
      let data = {
        name: this.subjectName,
        url: this.subjectURL,
      };
      db.collection("subjects")
        .add(data)
        .then(() => {
          this.subjectName = "";
          this.subjectURL = "";
          this.addSubjectBool = false;
          this.mountRun();
        });
    },
    mountRun() {
      this.items = [];
      this.notes = [];
      db.collection("subjects")
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            // // console.log(doc.data());
            var tempObj = {
              name: doc.data().name,
              url: doc.data().url,
              id: doc.id,
            };
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
            console.log(this.notes);
          });
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
