const Trainee = require("../../DB/models/trainees");

module.exports.getTraineeList = async (req, res) => {
  if (!req.user || req.user.user_type !== "agency") {
    return res.status(401).json({
      message: "Unauthorised Request",
    });
  }

  const pincode = req.query.pincode;

  try {
    const candidates = await Trainee.findAll({
      attributes: [
        "trainee_id",
        "name",
        "phone",
        "gender",
        "physically_challenged",
        "pincode",
        "domicile",
      ],
      where: { pincode: pincode },
    });
    console.log("list>> ", candidates);
    if (candidates) {
      const candidateList = candidates.map((candidate) => ({
        id: candidate.trainee_id,
        name: candidate.name,
        phone:
          candidate.phone.substring(0, 2) +
          "******" +
          candidate.phone.substring(8, 10),
        gender: candidate.gender,
        physically_challenged: candidate.physically_challenged,
        pincode: candidate.pincode,
        domicile: candidate.domicile,
      }));

      return res.status(200).json({
        message: "Successfully fetched the results",
        numOfRows: candidateList.length,
        candidateList,
      });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error!" });
  }

  return res.status(500).json({
    message: "Internal Server Error",
  });
};
