import React, { useState, useEffect } from "react";
import {View,Text,TextInput,ScrollView,StyleSheet,TouchableOpacity,} from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";
import { getFirestore, addDoc, collection, onSnapshot, query, orderBy, deleteDoc, doc, updateDoc } from "firebase/firestore";
import appFirebase from "./database/firebase";
import Task from "./components/Task";

// Referencia a la colección de tareas en Firestore
const db = collection(getFirestore(appFirebase), "tasks");

// Componente principal de la aplicación
const App = () => {
  // Estado para almacenar la lista de tareas
  const [tasks, setTasks] = useState([]);
  // Estado para almacenar el texto de la nueva tarea
  const [task, setTask] = useState("");

  // Efecto secundario para suscribirse a cambios en la base de datos
  useEffect(() => {
    // Función para cancelar la suscripción cuando el componente se desmonta
    const unsubscribe = onSnapshot(query(db, orderBy("timestamp")), (snapshot) => {
      // Mapea los documentos de la colección a un formato adecuado para el estado
      const taskList = snapshot.docs.map((doc) => ({
        id: doc.id,
        text: doc.data().text,
        isComplete: doc.data().isComplete || false,
        timestamp: doc.data().timestamp,
      }));

      // Ordenar tareas por fecha de creación (timestamp)
      taskList.sort((a, b) => b.timestamp - a.timestamp);

      // Actualiza el estado con la lista de tareas
      setTasks(taskList);
    });

    // Devuelve una función de limpieza para cancelar la suscripción cuando el componente se desmonta
    return () => unsubscribe();
  }, []);

  // Función para agregar una nueva tarea a la base de datos
  const addTask = async () => {
    if (task.trim()) {
      try {
        await addDoc(db, { text: task, timestamp: new Date(), isComplete: false });
        console.log("Tarea agregada a la base de datos");
        setTask(""); // Limpia el estado para el próximo ingreso
      } catch (error) {
        console.error("Error al agregar la tarea a la base de datos:", error);
      }
    }
  };

  // Función para eliminar una tarea de la base de datos y actualizar el estado local
  const deleteTask = async (taskId, taskText) => {
    try {
      await deleteDoc(doc(db, taskId));
      console.log("Tarea eliminada de la base de datos");

      // Filtra las tareas para eliminar la tarea eliminada
      const updatedTasks = tasks.filter((task) => task.id !== taskId);
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error al eliminar la tarea de la base de datos:", error);
    }
  };

  // Función para editar una tarea en la base de datos y actualizar el estado local
  const editTask = async (taskId, newText) => {
    try {
      const taskRef = doc(db, taskId);
      await updateDoc(taskRef, { text: newText });
      console.log("Tarea actualizada en la base de datos");

      // Actualiza el estado local con la tarea editada
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, text: newText } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error al actualizar la tarea en la base de datos:", error);
    }
  };

  // Función para cambiar el estado de completitud de una tarea y actualizar el estado local
  const toggleComplete = async (taskId, isComplete) => {
    try {
      const taskRef = doc(db, taskId);
      await updateDoc(taskRef, { isComplete });
      console.log("Estado de la tarea actualizado en la base de datos");

      // Actualiza el estado local con el estado de completitud cambiado
      const updatedTasks = tasks.map((task) =>
        task.id === taskId ? { ...task, isComplete } : task
      );
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error al actualizar el estado de la tarea en la base de datos:", error);
    }
  };

  // Renderización del componente
  return (
    <View style={styles.container}>
      {/* Encabezado de la aplicación */}
      <View style={styles.header}>
        <Text style={styles.headerText}>Mis Tareas</Text>
      </View>

      {/* Contenedor para la entrada de nuevas tareas */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Añadir tarea..."
          value={task}
          onChangeText={(text) => setTask(text)}
        />
        {/* Botón para agregar una nueva tarea */}
        <FontAwesome5 name="plus" size={24} color="green" onPress={addTask} />
      </View>

      {/* Lista de tareas */}
      <ScrollView style={styles.tasks}>
        {/* Mapea las tareas a componentes Task */}
        {tasks.map(({ id, text, isComplete }) => (
          <Task
            key={id}
            id={id}
            text={text}
            onDelete={deleteTask}
            onEdit={editTask}
            onToggleComplete={toggleComplete}
            isComplete={isComplete}
          />
        ))}
      </ScrollView>
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    marginTop: 20,
    backgroundColor: "#A569BD",
  },
  header: {
    marginTop: 20,
    marginBottom: 20,
    alignItems: "center",
  },
  headerText: {
    fontSize: 36,
    fontWeight: "bold",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 10,
    padding: 10,
    margin: 10,
    backgroundColor: "#FBFCFC",
  },
  tasks: {
    marginTop: 30,
  },
});

// Exporta el componente principal de la aplicación
export default App;
