export const NotesPDF = (description,doctorName,times,) => `
<body>
      <div style="width: 80%; margin: auto;">
        <div style="display: flex; justify-content: center; align-items: center;">
          
          <h2 style="color: blue; font-size: 20px; margin-left: 20px;">
            Aegle Doctor's Note
          </h2>
        </div>
        <div style="width: 80%; margin: 0 auto;">
          <p style="font-size: 12px; margin-top: 20px;">
            DOCTOR REPORT
          </p>
          <div
            style="
              border: 1px solid whitesmoke;
              border-radius: 8px;
              padding: 10px;
            "
          >
            <p style="color: grey; font-size: 12px;">Notes</p>
            <p style="color: black; font-size: 14px;">${description}</p>
          </div>
          <p style="font-size: 12px; margin-top: 20px;">
            DOCTOR DETAILS
          </p>
          <div
            style="
              border: 1px solid whitesmoke;
              border-radius: 8px;
              padding: 10px;
            "
          >
            <p style="color: grey; font-size: 12px;">Doctor's name</p>
            <p style="color: black; font-size: 14px;">${doctorName}</p>
            <hr />
            <p style="color: grey; font-size: 12px;">Date & Time</p>
            <p style="color: black; font-size: 14px;">${times}</p>
          </div>
        </div>
        <div  style="position: absolute; bottom: 0; right: 0; left: 0;">
        <p style="color: blue; text-align: center;">
          www.aeglehealth.io
        </p>
        <p
          style="
            color: blue;
            text-align: center;
            width: 70%;
            margin: auto;
            margin-bottom: 10px;
          "
        >
          For enquiries and complaints on referrals, prescriptions and sick
          notes, you can reach us via email at support@aeglehealth.io
        </p>
      </div>
      </div>
    </body>
`