import {
  View,
  Text,
  Modal,
  StyleSheet,
  Pressable,
  CheckBox,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { FontAwesome6 } from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Entypo } from "@expo/vector-icons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { TextInput } from "react-native-web";
import axios from "axios";

const Home = () => {
  const navigation = useNavigation();
  const [modalOpen, setModalOpen] = useState(false);
  const [formState, setFormState] = useState("add");
  const [name, setName] = useState("");
  const [descr, setDescr] = useState("");
  const [tasks, setTasks] = useState([]);
  const [idTask, setIdTask] = useState("");
  const [isImportant, setIsImportant] = useState(false);

  const loadTasks = () => {
    axios
      .get("http://localhost:8000/get")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.log("Login Error", error);
      });
  };

  const handleDelete = (taskId) => {
    axios
      .delete(`http://localhost:8000/tasksDelete/${taskId}`)
      .then((response) => {
        loadTasks();
      })
      .catch((error) => {
        console.log("Login Error", error);
      });
  };

  const handleEdit = (taskId) => {
    setIdTask(taskId);
    axios
      .get(`http://localhost:8000/getTask/${taskId}`)
      .then((response) => {
        setModalOpen(true);
        setName(response.data.name);
        setDescr(response.data.descr);
        setIsImportant(response.data.isImportant);
        setFormState("edit");
      })
      .catch((error) => {
        console.log("Login Error", error);
      });
  };

  const onSavePress = () => {
    axios
      .post("http://localhost:8000/save", { name, descr, isImportant })
      .then((response) => {
        loadTasks();
        setModalOpen(false);
        setName("");
        setDescr("");
      })
      .catch((error) => {
        console.log("Login Error", error);
      });
  };

  const onEditPress = () => {
    axios
      .post(`http://localhost:8000/tasks/${idTask}/update`, {
        name,
        descr,
        isImportant,
      })
      .then((response) => {
        loadTasks();
        setModalOpen(false);
        setName("");
        setDescr("");
      })
      .catch((error) => {
        console.log("Login Error", error);
      });
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const showImportantTasks = () => {
    axios
      .get(`http://localhost:8000/getImportantTasks`)
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.log("Login Error", error);
      });
  };

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerLeft: () => {
        return (
          <View style={{ flexDirection: "row", paddingLeft: 10 }}>
            <Pressable
              onPress={() => {
                loadTasks();
              }}
              style={{
                padding: 10,
                borderRadius: 10,
                borderWidth: 1,
                marginRight: 10,
                borderColor: "#f2f2f2",
              }}>
              <Text style={{ fontSize: 18 }}>Все</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                showImportantTasks();
              }}
              style={{
                padding: 10,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: "#f2f2f2",
              }}>
              <Text style={{ fontSize: 18 }}>Важные</Text>
            </Pressable>
          </View>
        );
      },
      headerRight: () => {
        return (
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 10,
              paddingRight: 10,
            }}>
            <FontAwesome6
              style={{ ...styles.modalToggle }}
              name="add"
              size={24}
              color="black"
              onPress={() => {
                setModalOpen(true);
                setIsImportant(false);
                setName("");
                setDescr("");
                setFormState("add");
              }}
            />
          </View>
        );
      },
    });
  }, []);

  return (
    <View style={{ paddingHorizontal: 10 }}>
      <Modal
        visible={modalOpen}
        animationType="fade"
        presentationStyle="pageSheet">
        <View style={styles.modalContent}>
          <View style={styles.modalClose}>
            <AntDesign
              style={{ ...styles.modalToggle }}
              name="close"
              size={24}
              color="black"
              onPress={() => setModalOpen(false)}
            />
          </View>

          <View
            style={{
              alignItems: "center",
              justifyContent: "center",
              marginTop: 200,
            }}>
            <TextInput
              value={name}
              placeholder={"Название"}
              placeholderTextColor={"black"}
              style={styles.modalInput}
              onChangeText={(text) => setName(text)}
            />
            <TextInput
              value={descr}
              placeholder={"Описание"}
              placeholderTextColor={"black"}
              style={styles.modalInput}
              onChangeText={(text) => setDescr(text)}
            />
            <View
              style={{
                justifyContent: "flex-start",
                flexDirection: "row",
                alignItems: "flex-start",
                width: "100%",
              }}>
              <CheckBox
                value={isImportant}
                onValueChange={setIsImportant}
                style={styles.checkbox}
              />
              <Text style={styles.label}>Важный</Text>
            </View>

            <Pressable
              onPress={formState === "add" ? onSavePress : onEditPress}>
              <Text
                style={{
                  color: "white",
                  fontSize: 16,
                  fontWeight: "bold",
                  textAlign: "center",
                  backgroundColor: "green",
                  padding: 10,
                  width: "100%",
                  borderRadius: 5,
                }}>
                {formState === "add" ? "Добавить" : "Редектировать"}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      <View style={{ paddingTop: 20 }}>
        {tasks.length > 0 &&
          tasks.map((item, index) => {
            return (
              <View
                key={item._id}
                style={{
                  marginBottom: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  borderBottomWidth: 1,
                }}>
                <View style={{ flexDirection: "row" }}>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 5,
                      marginRight: 10,
                    }}>
                    {index + 1}
                  </Text>
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: "bold",
                      marginBottom: 5,
                      marginRight: 10,
                    }}>
                    {item.name}
                  </Text>
                  <Text style={{ fontSize: 18, fontWeight: "bold" }}>
                    {item.descr}
                  </Text>
                </View>

                <View style={{ flexDirection: "row" }}>
                  <MaterialCommunityIcons
                    onPress={() => {
                      handleDelete(item._id);
                    }}
                    name="delete"
                    size={24}
                    color="black"
                  />
                  <Entypo
                    name="edit"
                    size={24}
                    color="black"
                    onPress={() => {
                      handleEdit(item._id);
                    }}
                  />
                </View>
              </View>
            );
          })}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  modalToggle: {
    borderWidth: 1,
    borderColor: "#f2f2f2",
    padding: 10,
    borderRadius: 10,
    alignSelf: "center",
  },
  modalClose: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-end",
    width: "100%",
    marginTop: 10,
  },
  modalContent: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  modalInput: {
    fontSize: 18,
    borderBottomColor: "gray",
    borderBottomWidth: 1,
    marginVertical: 10,
    width: "100%",
    outline: "none",
    marginBottom: 20,
  },
  checkbox: {
    alignSelf: "center",
  },
  label: {
    margin: 8,
  },
});
