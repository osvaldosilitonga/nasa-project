const {
  scheduleNewLaunch,
  getAllLaunches,
  existLaunchId,
  abortLaunchById,
} = require("../../models/launches.model");
const { getPagination } = require("../../utils/query");

async function httpGetAllLaunches(req, res) {
  const { skip, limit } = getPagination(req.query);

  const pagination = await getAllLaunches(skip, limit);
  return res.status(200).json(pagination);
}

async function httpAddNewLaunches(req, res) {
  const launch = req.body;
  if (
    !launch.mission ||
    !launch.rocket ||
    !launch.launchDate ||
    !launch.target
  ) {
    return res.status(400).json({
      error: "Missing Some Launch Information",
    });
  }

  launch.launchDate = new Date(launch.launchDate);
  if (isNaN(launch.launchDate)) {
    return res.status(400).json({
      error: "Date is not correct",
    });
  }

  await scheduleNewLaunch(launch);
  return res.status(201).json(launch);
}

async function httpAbortLaunches(req, res) {
  const launchId = Number(req.params.id);

  const existLaunch = await existLaunchId(launchId);

  // if launchId not exist
  if (!existLaunch) {
    return res.status(404).json({
      error: "Launch ID not found",
    });
  }

  const aborted = await abortLaunchById(launchId);
  if (aborted.matchedCount !== 1 && aborted.modifiedCount !== 1) {
    return res.status(400).json({ message: "Fail to Abort Launch" });
  }

  return res.status(200).json({ message: "Aborted Success" });
}

module.exports = {
  httpGetAllLaunches,
  httpAddNewLaunches,
  httpAbortLaunches,
};
