import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Image,
  FlatList,
  Button,
  TextInput,
  Modal,
  SafeAreaView,
} from "react-native";
import {
  collection,
  getDocs,
  query,
  orderBy,
  deleteDoc,
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  increment,
  onSnapshot,
  getFirestore,
  addDoc,
  where,
  getDoc,
} from "firebase/firestore";
import { db, auth } from "../firebase";
import Icon from "react-native-vector-icons/FontAwesome";
import { AntDesign } from '@expo/vector-icons';

const CommunityScreen = ({ route }) => {
  const { loggedInUser } = route.params || {};
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [commentText, setCommentText] = useState("");
  const [activePostId, setActivePostId] = useState(null);
  const [likedByUsers, setLikedByUsers] = useState([]);

  useEffect(() => {
    const postCollectionRef = collection(db, "posts");
    const q = query(postCollectionRef, orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(
      q,
      (querySnapshot) => {
        const postsArray = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setPosts(postsArray);
        setLoading(false);
      },
      (error) => {
        console.error("Firestore error", error);
        setLoading(false);
      }
    );

    return () => {
      unsubscribe();
    };
  }, []);

  // 게시물 삭제 함수
  const handleRemovePost = async (postId) => {
    try {
      const postRef = doc(db, "posts", postId);
      await deleteDoc(postRef);
    } catch (error) {
      console.error("게시물 삭제 오류", error);
    }
  };

  //좋아요 기능
  const handleToggleLike = async (postId, userId) => {
    const postRef = doc(db, "posts", postId);
    try {
      const postDoc = await getDoc(postRef);
      if (postDoc.exists()) {
        const post = postDoc.data();
        const likedByUsers = post.likedByUsers || [];
        const isLiked = likedByUsers.includes(userId);
        const updatedLikedByUsers = isLiked
          ? likedByUsers.filter((id) => id !== userId)
          : [...likedByUsers, userId];

          const likesCount = (post.likesCount != null) ? post.likesCount : 0;  // undefined =>0
          const likesIncrement = isLiked ? -1:1

        await updateDoc(postRef, {
          likedByUsers: updatedLikedByUsers,
          likesCount: likesCount +likesIncrement,
        });
        //상태 업데이트
        setPosts((currentPosts) =>
          currentPosts.map((post) => {
            if (post.id === postId) {
              return {
                ...post,
                likedByUsers: updatedLikedByUsers,
                likesCouu: (post.likesCount || 0) + (isLiked ? -1 : 1),
              };
            }
            return post;
          })
        );
      }
    } catch (error) {
      // 오류를 콘솔에 출력합니다.
      console.error("Error toggling like: ", error);
    }
  };

  //댓글 아이템들
  const renderCommentItem = ({ item }) => (
  <View
    style={{
      flexDirection: "row",
      alignItems: "center",
      padding: 8,
      borderBottomWidth: 1,
      borderBottomColor: "gray",
    }}
  >
    <View>
      <AntDesign name="leftcircleo" size={24} color="black" />
    </View>
    <Image
      source={{
        uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
      }}
      style={{ width: 30, height: 30, borderRadius: 15 }}
    />
    <View
      style={{
        flex: 1,
        justifyContent: "space-between",
        flexDirection: "row",
        alignItems: "center",
        marginLeft: 10,
      }}
    >
      <Text style={{ flex: 1 }}>{item.userName}</Text>
      {item.userName === loggedInUser.name && (
        <TouchableOpacity onPress={() => deleteComment(activePostId, item.id)}>
          <Text style={{ color: "gray" }}>삭제</Text>
        </TouchableOpacity>
      )}
    </View>
  </View>
);

  // 댓글 추가
  const addComment = async () => {
    console.log("Adding comment:", {
      commentText,
      activePostId,
      userUID: auth.currentUser?.uid,
      userName: loggedInUser ? loggedInUser.name : "User",
    });
    //로그인된 사용자 확인
    if (!loggedInUser) {
      console.error("로그인된 사용자 정보가 없습니다.");
      return;
    }
    if (commentText.trim() && activePostId) {
      const userName = loggedInUser.displayName || 'User';
      const userPhoto = loggedInUser.photoURL || "https://cdn-icons-png.flaticon.com/128/149/149071.png";
      const commentsRef = collection(db, "post", activePostId, "comments");
      try {
        await addDoc(commentsRef, {
          text: commentText,
          createdAt: new Date(),
          uid: auth.currentUser.uid,
          // 프로필 사진과 사용자 이름 정보 추가
          userPhoto: userPhoto,
          userName: userName,
        });
        setCommentText(""); // 입력 필드 초기화
      } catch (error) {
        console.error("댓글 추가 오류:", error);
      }
    }
  };

  // 댓글 삭제 함수
  const deleteComment = async (postId, commentId) => {
    const commentRef = doc(db, "post", postId, "comments", commentId);
    try {
      await deleteDoc(commentRef);
      // 삭제 후 댓글 목록을 새로고침하는 로직이 필요하면 여기에 추가
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  const handleCommentIconClick = (postId) => {
    setActivePostId(postId); // 활성화된 게시물 ID 설정
    setModalVisible(true); // 모달 열기
  };
  console.log("posts:", posts, Array.isArray(posts));
  const activePostComments = Array.isArray(posts)
    ? posts.find((post) => post.id === activePostId)?.comments || []
    : [];

    for (const comment of activePostComments) {
      const userRef = doc(db, "users", comment.uid); // 사용자 문서를 가져오는 참조
      const userDoc =getDoc(userRef); // 사용자 문서 가져오기
      if (userDoc.exists()) {
        const userData = userDoc.data();
        comment.userName = userData.displayName || "User"; // displayName을 추가
        comment.userPhoto = userData.photoURL || "https://cdn-icons-png.flaticon.com/128/149/149071.png"; // photoURL을 추가
      }
    }
  //게시물 로딩 시
  if (loading) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          SPG Community
        </Text>
        <View
          style={{
            flexDirection: "center",
            alignItems: "center",
            marginTop: 250,
          }}
        >
          <Text>Loading...</Text>
        </View>
      </ScrollView>
    );
  }
  //에러 시
  if (error) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          SPG Community
        </Text>
        <View
          style={{
            flexDirection: "center",
            alignItems: "center",
            marginTop: 250,
          }}
        >
          <Text>Error: {error.message}</Text>;
        </View>
      </ScrollView>
    );
  }
  //게시물 없을 시
  if (!posts.length) {
    return (
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          SPG Community
        </Text>
        <View
          style={{
            flexDirection: "center",
            alignItems: "center",
            marginTop: 250,
          }}
        >
          <Text>게시물이 없습니다.</Text>
        </View>
      </ScrollView>
    );
  }

  return (
    <>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 20 }}>
          SPG Community
        </Text>
        {Array.isArray(posts) &&
          posts.map((post, index) => (
            <View
              key={index}
              style={{
                backgroundColor: "#FFFFFF",
                borderRadius: 10,
                padding: 15,
                marginBottom: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 1 },
                shadowOpacity: 0.22,
                shadowRadius: 2.22,
                elevation: 3,
                position: "relative",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <Image
                  source={{
                    uri:
                      post.userPhoto ||
                      "https://cdn-icons-png.flaticon.com/128/149/149071.png",
                  }}
                  style={{
                    width: 50,
                    height: 50,
                    borderRadius: 25,
                    marginRight: 10,
                  }}
                />
                <Text style={{ fontWeight: "bold", fontSize: 16 }}>
                  {loggedInUser && loggedInUser.name
                    ? loggedInUser.name
                    : "User"}
                </Text>
                <TouchableOpacity
                  onPress={() => handleRemovePost(post.id)}
                  style={{
                    position: "absolute",
                    right: 10,
                    top: 10,
                  }}
                >
                  <Icon name="trash-o" size={20} color="black" />
                </TouchableOpacity>
              </View>
              <Text style={{ marginBottom: 10 }}>{post.text}</Text>
              {post.image && (
                <Image
                  source={{ uri: post.image }}
                  style={{
                    width: "100%",
                    height: 200,
                    marginBottom: 10,
                  }}
                />
              )}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  marginTop: 10,
                }}
              >
                <TouchableOpacity
                  onPress={() => handleToggleLike(post.id, auth.currentUser.uid)}
                  disabled={loading}
                  style={{ padding: 8 }}
                >
                  <Icon
                    name={
                      post.likedByUsers.includes(auth.currentUser.uid)
                        ? "heart"
                        : "heart-o"
                    }
                    size={20}
                    color={
                      post.likedByUsers.includes(auth.currentUser.uid)
                        ? "red"
                        : "black"
                    }
                  />
                  <Text>{post.likesCount || 0} likes </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => handleCommentIconClick(post.id)}
                  style={{ padding: 8 }}
                >
                  <Icon
                    name="comment-o"
                    size={20}
                    color="black"
                    style={{ flexDirection: "row", alignItems: "center" }}
                  />
                  <Text>comment</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
      </ScrollView>
      <Modal
        animationType="slide"
        transparent={false}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
            marginTop: 10,
            width: "100%",
          }}
        >
          <FlatList
            data={activePostComments}
            renderItem={renderCommentItem}
            keyExtractor={(item) => item.id}
          />
          <View
            style={{
              margin: 10,
              backgroundColor: "white",
              borderRadius: 10,
              padding: 10,
              width: "98%",
              justifyContent: "space-between",
              flexDirection: "row",
              alignItems: "center",
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.25,
              shadowRadius: 4,
              elevation: 5,
            }}
          >
            <Image
              source={{
                uri: "https://cdn-icons-png.flaticon.com/128/149/149071.png",
              }}
              style={{ width: 30, height: 30, borderRadius: 15 }}
            />
            <TextInput
              placeholder="댓글을 입력하세요..."
              value={commentText}
              onChangeText={setCommentText}
              style={{ marginBottom: 15, textAlign: "center" }}
            />
            <Button
              title="댓글 전송"
              onPress={() => {
                addComment();
                setModalVisible(!modalVisible);
              }}
            />
          </View>
        </View>
      </Modal>
    </>
  );
};

export default CommunityScreen;
