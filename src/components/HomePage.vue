<template>
  <v-container fluid>
    <v-overlay v-if="overlay" class="d-flex align-center justify-center">
      <v-progress-circular indeterminate :size="59" :width="12"></v-progress-circular>
    </v-overlay>

    <v-row class="pl-6">
      <v-col>
        <v-dialog v-model="AddNoteBool" max-width="600px">
          <template v-slot:activator="{ on }">
            <v-btn color=#3fc96b dark v-on="on">New Note</v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="headline">Add a Note</span>
            </v-card-title>
            <v-card-text>
              <v-container>
                <v-row>
                  <v-col>
                    <v-textarea v-model="toAddNote" label="Write your note here" outlined rows="8" auto-grow dense
                      full-width></v-textarea>
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
      </v-col>
    </v-row>
    <v-row class="my-5">
      <v-col v-for="(note, index) in notes" :key="index" cols="12" sm="6" md="4" lg="2">
        <v-card class="mx-auto my-3" max-width="500" height="200" color="accent lighten-5" elevation="10" outlined
          hover>
          <!-- Card Header -->
          <v-card-title class="d-flex justify-space-between">
            <span class="text-h6 font-weight-bold">Note #{{ total - index }}</span>
            <v-btn icon small color="red" @click="deleteNote(note.id)">
              <v-icon>mdi-delete</v-icon>
            </v-btn>
          </v-card-title>

          <!-- Scrollable Content -->
          <v-card-text class="text-body-2 text-justify"
            style="overflow-y: auto; max-height: 100px; white-space: pre-wrap;">
            {{ note.note }}
          </v-card-text>

          <!-- Card Actions -->
          <v-card-actions class="d-flex justify-end" style="position: absolute; bottom: 0; right: 0; width: 100%;">
            <v-btn small color="green" outlined dark class="mr-2" @click="copyNoteContent(note.note)">
              <v-icon left small>mdi-content-copy</v-icon>
              Copy
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>

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
      notes: [],
      AddNoteBool: false,
      toAddNote: "",
      total: 0
    };
  },
  mounted() {
    this.fetchNotes();
  },
  methods: {
    fetchNotes() {
      this.notes = [];
      this.overlay = true;
      db.collection("notes")
        .where("id", "==", VueCookies.get("uid"))
        .orderBy('timestamp', 'desc')
        .get()
        .then((snapshot) => {
          snapshot.forEach((doc) => {
            this.notes.push({
              note: doc.data().note,
              id: doc.id,
            });
          });
          this.total = this.notes.length
          this.overlay = false;
        })
        .catch((err) => {
          console.error("Error fetching notes", err);
        });
    },
    deleteNote(id) {
      this.overlay = true;
      db.collection("notes")
        .doc(id)
        .delete()
        .then(() => {
          this.fetchNotes();
        });
    },
    addNoteToDB() {
      if (this.toAddNote.trim() === "") {
        return;
      }
      this.AddNoteBool = false;
      this.overlay = true;
      const data = {
        note: this.toAddNote,
        id: VueCookies.get("uid"),
        timestamp: Date.now(),
      };
      db.collection("notes")
        .add(data)
        .then(() => {
          this.toAddNote = "";
          this.fetchNotes();
        });
    },
    copyNoteContent(noteContent) {
      navigator.clipboard.writeText(noteContent).then(() => {
        alert("Note copied to clipboard!");
      }).catch(err => {
        console.error("Failed to copy text: ", err);
      });
    },
  },
};
</script>

<style>
.text-justify {
  text-align: justify;
  white-space: pre-wrap;
}
</style>
