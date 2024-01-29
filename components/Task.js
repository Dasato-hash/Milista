import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, TextInput, Image } from "react-native";
import { FontAwesome5 } from "@expo/vector-icons";

// El componente Task recibe props como id, text, onDelete, onEdit, onToggleComplete, isComplete
const Task = ({ id, text, onDelete, onEdit, onToggleComplete, isComplete }) => {
  // Estados locales para controlar si está en modo de edición y el texto editado
  const [isEditing, setIsEditing] = useState(false);
  const [editedText, setEditedText] = useState(text);

  // Función para manejar la eliminación de la tarea
  const handleDelete = () => {
    onDelete(id, text);
  };

  // Función para manejar la edición de la tarea
  const handleEdit = async () => {
    if (isEditing) {
      // Si está en modo de edición, llama a onEdit con el id y el texto editado
      await onEdit(id, editedText);
      // Sale del modo de edición
      setIsEditing(false);
    } else {
      // Si no está en modo de edición, entra en modo de edición
      setIsEditing(true);
    }
  };

  // Función para manejar el cambio de estado de completitud de la tarea
  const handleToggleComplete = async () => {
    // Llama a onToggleComplete con el id y el estado contrario de isComplete
    await onToggleComplete(id, !isComplete);
  };

  return (
    // Contenedor principal de la tarea
    <View style={styles.task}>
      {/* Condición para renderizar el componente de edición o el componente de texto */}
      {isEditing ? (
        // Componente de edición, un TextInput
        <TextInput
          style={styles.editInput}
          value={editedText}
          onChangeText={(text) => setEditedText(text)}
          autoFocus
        />
      ) : (
        // Componente de texto, un Text dentro de un contenedor View
        <View style={styles.textWrapper}>
          <Text style={isComplete ? styles.completedText : styles.text}>{text}</Text>
        </View>
      )}
      {/* Contenedor de botones */}
      <View style={styles.buttonsWrapper}>
        {/* Botón de edición */}
        <TouchableOpacity onPress={handleEdit} style={styles.editButton}>
          <FontAwesome5 name={isEditing ? "check" : "edit"} size={24} color={isEditing ? "green" : "blue"} style ={styles.marque} />
        </TouchableOpacity>
        {/* Botón de eliminación */}
        <TouchableOpacity onPress={handleDelete}>
          <FontAwesome5 name="trash-alt" size={24} color="red" style ={styles.marque} />
        </TouchableOpacity>
        {/* Botón para cambiar el estado de completitud */}
        <TouchableOpacity onPress={handleToggleComplete}>
          <FontAwesome5 name={isComplete ? "check-square" : "square"} size={24} color="orange" style ={styles.marque} />
        </TouchableOpacity>
        {/* Imagen */}
        <Image source={require('../assets/One.png')} style={styles.image} />
        
      </View>
    </View>
  );
};

// Estilos del componente
const styles = StyleSheet.create({
  task: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#e0e0e0",
    padding: 15,
    borderRadius: 10,
    margin: 10,
  },
  textWrapper: {
    flex: 1,
  },
  text: {
    fontSize: 18,
  },
  completedText: {
    fontSize: 18,
    textDecorationLine: "line-through",
    color: "gray",
  },
  editInput: {
    flex: 1,
    fontSize: 18,
    borderWidth: 1,
    borderColor: "#777",
    borderRadius: 5,
    padding: 5,
  },
  buttonsWrapper: {
    flexDirection: "row",
  },
  editButton: {
    marginRight: 10,
  },
  image: {
    width: 40, 
    height: 40, 
  },
  marque:{
    padding:  10,
  }
});

// Exporta el componente Task
export default Task;