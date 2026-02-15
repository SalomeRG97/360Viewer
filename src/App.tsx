// import "./App.css";
// import Visor360 from "./components/Visor360";
// import project from "./data/wangari.json";

// function App() {
//   return (
//     <div style={{ width: "100vw", height: "100vh" }}>
//       <Visor360 DBHotspots={project} />
//     </div>
//   );
// }

// export default App;
import { useEffect, useState } from "react";
import Visor360 from "./components/Visor360";
import "./App.css";

const API_URL = "https://ex-view.com/360Viewer/api/project.php";

function App() {
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(API_URL)
      .then((res) => res.json())
      .then((data) => {
        setProject(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando proyecto:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Cargando…</div>;
  if (!project) return <div>Error cargando datos</div>;

  return (
    <div style={{ width: "100vw", height: "100vh" }}>
      <Visor360 DBHotspots={project} />
    </div>
  );
}

export default App;
