import * as React from "react";

import { useNavigate } from "react-router-dom";

import { supervisionType } from "../../../types";

import LeafletMapMulti from "./LeafletMapInspectSupervisionsMulti";

// @ts-ignore
import Pdf from "react-to-pdf";

interface ReportPageProps {
  supervisions: supervisionType[];
  handlePdfGenerated: () => void;
}

const ref = React.createRef();

const ReportPage: React.FC<ReportPageProps> = ({
  supervisions,
  handlePdfGenerated,
}) => {
  const downloadPdf = React.useRef();

  const checkIfAllMapsRendered = async () => {
    if (
      !document.getElementById("report-map") &&
      document.getElementById("downloadPdfBtn")
    ) {
      document.getElementById("downloadPdfBtn")!.click();
    }
  };

  return (
    <div style={{ width: "100%", height: "100%" }}>
      <Pdf
        targetRef={ref}
        filename="code-example.pdf"
        scale={0.52}
        onComplete={handlePdfGenerated}
      >
        {/* @ts-ignore */}
        {({ toPdf }) => (
          <button onClick={toPdf} hidden id="downloadPdfBtn">
            Generate pdf
          </button>
        )}
      </Pdf>
      <h1>Venter på nedlasting...</h1>
      <h2>Vennligst ikke forlat denne siden</h2>
      {/* @ts-ignore */}
      <div ref={ref} style={{ width: "100%" }}>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
        <div
          style={{
            width: "50%",
            height: "400px",
            border: "1px solid #333333",
          }}
        >
          <LeafletMapMulti
            supervision={supervisions[0]}
            checkIfAllMapsRendered={checkIfAllMapsRendered}
          ></LeafletMapMulti>
        </div>
      </div>
    </div>
  );
};

export default ReportPage;
