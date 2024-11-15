const db = require("../../DB/models");

const Trainee = db.trainees;
const Cart = db.carts;
const Bought = db.boughts;

module.exports.getTraineeList = async (req, res) => {
  if (!req.user || req.user.user_type !== "agency") {
    return res.status(401).json({
      message: "Unauthorised Request",
    });
  }

  const pincode = req.query.pincode;

  try {
    const candidates = await Trainee.findAll({
      attributes: { exclude: ["email", "aadhar"] },
      where: { pincode: pincode },
      include: [
        {
          model: Bought,
          as: "agencyThatBought",
          required: false, // This makes it an outer join
        },
      ],
    });

    if (candidates) {
      const candidateList = candidates.map((candidate) => ({
        trainee_id: candidate.trainee_id,
        name: candidate.name,
        domicile: candidate.domicile,
        physically_challenged: candidate.physically_challenged,
        gender: candidate.gender,
        district: candidate.district,
        block: candidate.block,
        pincode: candidate.pincode,
        age: candidate.age,
        education: candidate.education,
        agent_id: candidate.agent_id,
        religion: candidate.religion,
        isEnrolled: candidate.isEnrolled,
        Phone:
          candidate.phone.substring(0, 2) +
          "******" +
          candidate.phone.substring(8, 10),
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
