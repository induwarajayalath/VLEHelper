<template>
  <div class="home-page">
    <v-overlay v-if="overlay" class="align-center justify-center" z-index="1000">
      <v-progress-circular indeterminate size="64" width="6" color="primary"></v-progress-circular>
    </v-overlay>

    <!-- Header Section -->
    <v-container class="py-8 px-6">
      <v-row align="center" justify="space-between" class="mb-8">
        <v-col cols="auto">
          <h2 class="page-title">My Notes</h2>
          <p class="page-subtitle">Your personal space for quick thoughts</p>
        </v-col>
        <v-col cols="auto">
          <v-dialog v-model="AddNoteBool" max-width="600px" persistent>
            <template v-slot:activator="{ on }">
              <v-btn color="primary" large class="rounded-lg action-btn" elevation="2" v-on="on">
                <v-icon left>mdi-plus</v-icon>
                New Note
              </v-btn>
            </template>
            <v-card class="rounded-xl pa-4">
              <v-card-title class="pb-2">
                <span class="text-h5 font-weight-bold">Create New Note</span>
              </v-card-title>
              <v-card-text>
                <v-textarea
                  v-model="toAddNote"
                  label="What's on your mind?"
                  outlined
                  rows="8"
                  auto-grow
                  hide-details
                  class="rounded-lg modern-textarea"
                ></v-textarea>
              </v-card-text>
              <v-card-actions class="pt-4">
                <v-spacer></v-spacer>
                <v-btn text color="grey darken-1" class="font-weight-bold" @click="AddNoteBool = false">Cancel</v-btn>
                <v-btn depressed color="primary" class="rounded-lg px-6 font-weight-bold" @click="addNoteToDB()">Save Note</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-col>
      </v-row>

      <!-- Empty State -->
      <div v-if="!overlay && notes.length === 0" class="empty-state">
        <v-icon size="120" color="grey lighten-2">mdi-note-text-outline</v-icon>
        <h3 class="mt-4 grey--text text--darken-2">No notes yet</h3>
        <p class="grey--text">Click the 'New Note' button to start writing your first note.</p>
      </div>

      <!-- Notes Grid -->
      <v-row v-else>
        <v-col v-for="(note, index) in notes" :key="index" cols="12" sm="6" md="4" lg="3">
          <v-card class="note-card rounded-xl" elevation="1">
            <v-card-title class="d-flex justify-space-between align-center px-4 pt-4 pb-0">
              <span class="note-index">#{{ total - index }}</span>
              <v-btn icon color="error" class="delete-btn" @click="deleteNote(note.id)">
                <v-icon>mdi-delete-outline</v-icon>
              </v-btn>
            </v-card-title>

            <v-card-text class="note-content px-4 py-4">
              {{ note.note }}
            </v-card-text>

            <v-divider class="mx-4 opacity-10"></v-divider>

            <v-card-actions class="px-4 py-3">
              <v-spacer></v-spacer>
              <v-btn depressed color="success" class="copy-btn font-weight-bold rounded-lg px-4" @click="copyNoteContent(note.note)">
                <v-icon left small>mdi-content-copy</v-icon>
                Copy Content
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </div>
</template>

<script>
import db from "../api/firebaseInit";
import Vue from "vue";
import VueCookies from "vue-cookies";
import VueSimpleAlert from "vue-simple-alert";

Vue.use(VueSimpleAlert, { reverseButtons: true });
Vue.use(VueCookies);

export default {
  data() {
    return {
      overlay: false,
      notes: [],
      AddNoteBool: false,
      toAddNote: "",
      total: 0,
      unsubscribe: null
    };
  },
  mounted() {
    this.setupNotesListener();
  },
  beforeDestroy() {
    if (this.unsubscribe) {
      this.unsubscribe();
    }
  },
  methods: {
    setupNotesListener() {
      this.overlay = true;
      const uid = VueCookies.get("uid");
      if (!uid) {
        this.overlay = false;
        return;
      }

      this.unsubscribe = db.collection("notes")
        .where("id", "==", uid)
        .orderBy('timestamp', 'desc')
        .onSnapshot((snapshot) => {
          const notes = [];
          snapshot.forEach((doc) => {
            notes.push({
              note: doc.data().note,
              id: doc.id,
            });
          });
          this.notes = notes;
          this.total = notes.length;
          this.overlay = false;
        }, (err) => {
          console.error("Error with notes listener", err);
          this.overlay = false;
        });
    },
    deleteNote(id) {
      this.$confirm("Are you sure you want to delete this note?", "Delete Note", "warning").then(() => {
        db.collection("notes")
          .doc(id)
          .delete()
          .catch(err => {
            console.error("Error deleting note", err);
          });
      });
    },
    addNoteToDB() {
      if (this.toAddNote.trim() === "") {
        return;
      }
      this.AddNoteBool = false;
      const data = {
        note: this.toAddNote,
        id: VueCookies.get("uid"),
        timestamp: Date.now(),
      };
      db.collection("notes")
        .add(data)
        .then(() => {
          this.toAddNote = "";
        })
        .catch(err => {
          console.error("Error adding note", err);
        });
    },
    copyNoteContent(noteContent) {
      navigator.clipboard.writeText(noteContent).then(() => {
        this.$fire({
          title: "Copied!",
          type: "success",
          timer: 1000,
          showConfirmButton: false
        });
      }).catch(err => {
        console.error("Failed to copy text: ", err);
      });
    },
  },
};
</script>

<style scoped>
.home-page {
  background-color: #f7f8f2;
  min-height: 100vh;
}

.page-title {
  font-size: 2rem;
  font-weight: 800;
  color: #0f172a;
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 1rem;
  color: #64748b;
  margin-bottom: 0;
}

.action-btn {
  text-transform: none;
  font-weight: 700;
  letter-spacing: 0.3px;
}

.note-card {
  transition: all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  border: 1px solid #e2e8f0 !important;
  background-color: white !important;
  height: 100%;
  display: flex;
  flex-direction: column;
}

.note-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1) !important;
}

.note-index {
  font-size: 0.75rem;
  font-weight: 700;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.note-content {
  font-size: 0.95rem;
  line-height: 1.6;
  color: #334155;
  flex-grow: 1;
  overflow-y: auto;
  max-height: 200px;
  white-space: pre-wrap;
}

.note-content::-webkit-scrollbar {
  width: 4px;
}

.note-content::-webkit-scrollbar-thumb {
  background-color: #e2e8f0;
  border-radius: 10px;
}

.delete-btn:hover {
  color: #ef4444 !important;
  background-color: #fef2f2 !important;
}

.copy-btn {
  text-transform: none;
  letter-spacing: 0;
}

.empty-state {
  text-align: center;
  padding: 100px 20px;
}

.modern-textarea >>> fieldset {
  border-color: #e2e8f0 !important;
}

.modern-textarea >>> .v-label {
  color: #94a3b8 !important;
}

.opacity-10 {
  opacity: 0.1;
}
</style>

