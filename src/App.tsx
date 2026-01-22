import React, { useState } from "react";
import {
  IonApp,
  IonPage,
  IonHeader,
  IonToolbar,
  IonContent,
  IonFooter,
  IonButton,
} from "@ionic/react";
import { Camera, CameraResultType, CameraSource } from "@capacitor/camera";
import "./App.css";
import logo from "./assets/logo.png";

const SERVER_UPLOAD_URL = "https://picgpt-backend.onrender.com/analyze"; //

type Page = "home" | "main" | "pic" | "analysis" | "help";

const App: React.FC = () => {
  const [page, setPage] = useState<Page>("home");
  const [photo, setPhoto] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const pickImage = async (source: CameraSource) => {
    try {
      const img = await Camera.getPhoto({
        quality: 85,
        resultType: CameraResultType.Base64,
        source,
      });

      Camera.checkPermissions();
      if (!img.base64String) return;

      const dataUrl = `data:image/${img.format};base64,${img.base64String}`;
      setPhoto(dataUrl);
      setPage("analysis");
      void analyzeImage(dataUrl);
    } catch (err) {
      console.error(err);
    }
  };

  const analyzeImage = async (dataUrl: string) => {
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch(SERVER_UPLOAD_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ image: dataUrl }),
      });

      const txt = await res.text();
      let json: unknown;

      try {
        json = JSON.parse(txt);
      } catch {
        throw new Error(txt);
      }

      const output = (json as { output?: string }).output ?? "No output returned.";
      setResult(output);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setResult("Error: " + message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonApp>
      <IonPage>
        {/* HEADER */}
        <IonHeader className="appHeader">
          <IonToolbar className="toolbar">
            <div className="toolbarInner">
              <div className="toolbarLeft">
                <img src={logo} className="logo" alt="PicGPT logo" />
                <div className="brand">PicGPT</div>
              </div>

              <div className="toolbarRight">
                {page !== "help" ? (
                  <IonButton
                    fill="outline"
                    className="headerBtn"
                    onClick={() => setPage("help")}
                  >
                    Help
                  </IonButton>
                ) : (
                  <IonButton
                    fill="outline"
                    className="headerBtn"
                    onClick={() => setPage("home")}
                  >
                    Home
                  </IonButton>
                )}
              </div>
            </div>
          </IonToolbar>
        </IonHeader>

        {/* MAIN CONTENT */}
        <IonContent className="appContent">
          <div className="screenWrapper">
            <div className="phonePanel">
              {page === "home" && (
                <div className="pageBody">
                  <h1 className="titleLarge">Welcome to PicGPT</h1>
                  <IonButton
                    className="primaryBtn"
                    expand="block"
                    onClick={() => setPage("main")}
                  >
                    Get started
                  </IonButton>
                </div>
              )}

              {page === "main" && (
                <div className="pageBody">
                  <h2 className="titleMedium">
                    Select your picture for GPT analysis
                  </h2>

                  <div className="bigTile" onClick={() => setPage("pic")}>
                    <div className="tileIcon">🖼️</div>
                  </div>
                </div>
              )}

              {page === "pic" && (
                <div className="pageBody">
                  <h2 className="titleMedium">
                    Select your picture for GPT analysis
                  </h2>

                  <div className="uploadBox">
                    <p className="uploadText">
                      Choose an existing photo or take a new one.
                    </p>

                    <IonButton
                      className="secondaryBtn"
                      expand="block"
                      onClick={() => pickImage(CameraSource.Photos)}
                    >
                      Choose picture
                    </IonButton>

                    <IonButton
                      className="secondaryBtn outline"
                      expand="block"
                      onClick={() => pickImage(CameraSource.Camera)}
                    >
                      Take picture
                    </IonButton>
                  </div>
                </div>
              )}

              {page === "analysis" && (
                <div className="pageBody">
                  <h2 className="titleMedium">Analysis</h2>

                  <div className="analysisLayout">
                    {photo && (
                      <img
                        src={photo}
                        className="preview"
                        alt="Selected for analysis"
                      />
                    )}

                    <div className="analysisBubble">
                      {loading && <div className="loader">Analyzing…</div>}
                      {!loading && result && (
                        <div className="resultText">{result}</div>
                      )}
                    </div>
                  </div>

                  <IonButton
                    className="primaryBtn secondarySpacing"
                    expand="block"
                    onClick={() => setPage("pic")}
                  >
                    Back
                  </IonButton>
                </div>
              )}

              {page === "help" && (
                <div className="pageBody">
                  <h2 className="titleMedium">Help</h2>

                  <div className="helpCard">
                    <p>
                      PicGPT analyzes your pictures using AI and returns a natural
                      language description.
                    </p>
                    <p>
                      Photos are sent securely to our server only for analysis
                      and are removed shortly after processing. No personal data
                      is sold or shared.
                    </p>
                    <p>
                      Results may not always be perfectly accurate and should not
                      be used for critical decisions.
                    </p>
                    <p>
                      For questions or support, contact{" "}
                      <strong>support@picgpt.com</strong>.
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </IonContent>

        {/* FOOTER */}
        <IonFooter className="appFooter">
          <div className="footerInner">
            <div className="copyright">PicGPT 2025©</div>
            <div className="terms">
              By using our service you agree to our terms of service.
            </div>
          </div>
        </IonFooter>
      </IonPage>
    </IonApp>
  );
};

export default App;


