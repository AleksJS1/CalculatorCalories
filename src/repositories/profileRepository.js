const UserProfile = require('../models/UserProfile');

class ProfileRepository {
  async getLatestProfile() {
    return UserProfile.findOne({}).sort({ createdAt: -1 }).lean();
  }

  async createProfile(payload) {
    const profile = new UserProfile(payload);
    return profile.save();
  }

  async updateLatestProfile(payload) {
    const latest = await UserProfile.findOne({}).sort({ createdAt: -1 });
    if (!latest) {
      return this.createProfile(payload);
    }

    latest.name = payload.name;
    latest.age = payload.age;
    latest.sex = payload.sex;
    latest.heightCm = payload.heightCm;
    latest.weightKg = payload.weightKg;
    latest.activityLevel = payload.activityLevel;

    return latest.save();
  }

  async getProfileHistory(limit = 30) {
    return UserProfile.find({}).sort({ createdAt: -1 }).limit(limit).lean();
  }
}

module.exports = {
  ProfileRepository
};
