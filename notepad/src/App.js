import React, { useState, useEffect } from "react";
import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  Modifier,
} from "draft-js";
import "draft-js/dist/Draft.css";

const App = () => {
  const [editorState, setEditorState] = useState(() =>
    EditorState.createEmpty()
  );

  const [editorHover, setEditorHover] = useState(false);
  const [buttonHover, setButtonHover] = useState(false);

 
  useEffect(() => {
    localStorage.removeItem("editorContent"); 
    setEditorState(EditorState.createEmpty()); 
  }, []);

  const saveContent = () => {
    const contentState = editorState.getCurrentContent();
    
   
    console.log("Editor content state:", contentState);
    
    if (contentState.hasText()) {
      try {
     
        const rawContent = convertToRaw(contentState);
        console.log("Converted raw content:", rawContent);
  
        localStorage.setItem("editorContent", JSON.stringify(rawContent));
  
        alert("Content saved successfully!");
        console.log("Content saved to localStorage!");
  
        
        setEditorState(EditorState.createEmpty());
      } catch (error) {
        console.error("Error saving content:", error);
        
        if (error.name === 'QuotaExceededError') {
          alert("LocalStorage quota exceeded! Try clearing storage.");
        } else {
          alert("Error saving content. Please try again.");
        }
      }
    } else {
      alert("No content to save.");
    }
  };
  

  const handleBeforeInput = (chars) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();
    const blockKey = selectionState.getStartKey();
    const blockText = contentState.getBlockForKey(blockKey).getText();
    const cursorOffset = selectionState.getStartOffset();

    if (chars === " " && cursorOffset === blockText.length) {
      if (blockText.startsWith("***")) {
        applyInlineStyle("UNDERLINE", blockText.slice(3).trim()); 
        return "handled";
      }
      if (blockText.startsWith("**")) {
        applyInlineStyle("RED", blockText.slice(2).trim()); 
        return "handled";
      }
      if (blockText.startsWith("*")) {
        applyInlineStyle("BOLD", blockText.slice(1).trim()); 
        return "handled";
      }
      if (blockText.startsWith("#")) {
        applyBlockStyle("header-one", blockText.slice(1).trim()); 
        return "handled";
      }
    }

    return "not-handled";
  };

  const applyBlockStyle = (style, text) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    const newContentState = Modifier.replaceText(
      contentState,
      selectionState.merge({
        anchorOffset: 0,
        focusOffset: selectionState.getEndOffset(),
      }),
      text
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-block-type"
    );

    setEditorState(RichUtils.toggleBlockType(newEditorState, style));
  };

  const applyInlineStyle = (style, text) => {
    const contentState = editorState.getCurrentContent();
    const selectionState = editorState.getSelection();

    const newContentState = Modifier.replaceText(
      contentState,
      selectionState.merge({
        anchorOffset: 0,
        focusOffset: selectionState.getEndOffset(),
      }),
      text
    );

    const newEditorState = EditorState.push(
      editorState,
      newContentState,
      "change-inline-style"
    );

    setEditorState(RichUtils.toggleInlineStyle(newEditorState, style));
  };

  const customStyleMap = {
    RED: {
      color: "red",
    },
    UNDERLINE: {
      textDecoration: "underline",
    },
  };

  const styles = {
    body: {
      margin: 0,
      padding: 0,
      backgroundImage: "url('https://img.freepik.com/premium-photo/flowers-pink-background_935395-181718.jpg')", // Set your image URL here
      backgroundSize: "cover", 
      backgroundPosition: "center", 
      height: "100vh", 
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
    },
    container: {
      padding: "40px",
      maxWidth: "800px",
      margin: "auto",
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      color: "#333",
      background: "linear-gradient(135deg, #e0f7fa, #fce4ec)", 
      borderRadius: "10px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
      marginTop: "120px",
    },
    title: {
      textAlign: "center",
      color: "rgb(128, 72, 120)",
      fontSize: "28px",
      fontWeight: "bold",
      marginBottom: "20px",
      textShadow: "2px 2px 5px rgba(0, 0, 0, 0.1)",
    },
    editorWrapper: {
      border: "2px solid rgb(128, 72, 120)",
      borderRadius: "8px",
      padding: "15px",
      width:"700px",
      minHeight: "200px",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
      backgroundColor: "#f4f7fc", 
      transition: "box-shadow 0.3s ease",
    },
    editorWrapperHover: {
      boxShadow: "0 6px 15px rgba(0, 0, 0, 0.3)",
    },
    saveButton: {
      marginTop: "15px",
      padding: "12px 25px",
      backgroundColor: "#007BFF",
      border: "none",
      borderRadius: "5px",
      color: "#fff",
      fontSize: "16px",
      fontWeight: "bold",
      cursor: "pointer",
      display: "block",
      margin: "15px auto 0",
      boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
      transition: "background-color 0.3s ease, transform 0.2s ease",
      backgroundColor: "rgb(128, 72, 120)",
    },
    saveButtonHover: {
      backgroundColor: "rgb(128, 72, 120)",
      transform: "translateY(-2px)",
    },
  };

  return (
    <div style={styles.body}>
      <div style={styles.container}>
        <h1 style={styles.title}>Demo Editor by Syed Rizwana</h1>
        <div
          style={{
            ...styles.editorWrapper,
            ...(editorHover ? styles.editorWrapperHover : {}),
          }}
          onMouseEnter={() => setEditorHover(true)}
          onMouseLeave={() => setEditorHover(false)}
        >
          <Editor
            editorState={editorState}
            onChange={setEditorState}
            handleBeforeInput={handleBeforeInput}
            customStyleMap={customStyleMap}
          />
        </div>
        <button
          style={{
            ...styles.saveButton,
            ...(buttonHover ? styles.saveButtonHover : {}),
          }}
          onMouseEnter={() => setButtonHover(true)}
          onMouseLeave={() => setButtonHover(false)}
          onClick={saveContent}
        >
          Save
        </button>
      </div>
    </div>
  );
};

export default App;
