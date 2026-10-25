const supabase = require("../config/supabase");
const { uploadImageToCloudinary } = require("../utils/imageUploader");

exports.updateProfile = async (req, res) => {
    try {
        const { dateOfBirth = "", about = "", contactNumber, gender } = req.body;
        const id = req.user.id;

        if (!contactNumber || !gender || !id) {
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        const cleanDob = dateOfBirth && String(dateOfBirth).trim() ? String(dateOfBirth).trim() : null;
        const cleanContact = contactNumber ? String(contactNumber).trim() : null;
        const cleanGender = gender ? String(gender).trim() : null;
        const cleanAbout = about ? String(about).trim().substring(0, 1000) : "";

        const { data: profile, error } = await supabase
            .from('profiles')
            .update({
                date_of_birth: cleanDob,
                about: cleanAbout,
                gender: cleanGender,
                contact_number: cleanContact,
                updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            profileDetails: profile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            error: error.message,
        });
    }
};

exports.deleteAccount = async (req, res) => {
    try {
        const id = req.user.id;
        
        // 1. Delete user from Supabase Auth (This will cascade to public.profiles)
        const { error } = await supabase.auth.admin.deleteUser(id);
        
        if (error) throw error;

        return res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "User cannot be deleted",
            error: error.message
        });
    }
};

exports.getAllUserDetails = async (req, res) => {
    try {
        const id = req.user.id;
        const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;

        res.status(200).json({
            success: true,
            message: "User data fetched successfully",
            data: profile,
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        });
    }
};

exports.updateDisplayPicture = async (req, res) => {
    try {
        const displayPicture = req.files.displayPicture
        const userId = req.user.id
        const image = await uploadImageToCloudinary(
            displayPicture,
            process.env.FOLDER_NAME,
            1000,
            1000
        )
        
        const { data: updatedProfile, error } = await supabase
            .from('profiles')
            .update({ image: image.secure_url })
            .eq('id', userId)
            .select()
            .single();

        if (error) throw error;

        res.send({
            success: true,
            message: `Image Updated successfully`,
            data: updatedProfile,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.getEnrolledCourses = async (req, res) => {
    try {
        const userId = req.user.id
        const { data: enrollments, error } = await supabase
            .from('enrollments')
            .select('*, courses(*)')
            .eq('user_id', userId);

        if (error) throw error;

        const courses = enrollments.map(e => e.courses);

        return res.status(200).json({
            success: true,
            data: courses,
        })
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message,
        })
    }
}

exports.instructorDashboard = async (req, res) => {
    try {
        const instructorId = req.user.id;
        
        // Fetch courses first
        const { data: courses, error: coursesError } = await supabase
            .from('courses')
            .select('*')
            .eq('instructor_id', instructorId);

        if (coursesError) throw coursesError;

        if (!courses || courses.length === 0) {
            return res.status(200).json({ success: true, courses: [] });
        }

        // Fetch enrollment counts separately (safer approach)
        const courseIds = courses.map(c => c.id);
        const { data: enrollments, error: enrollError } = await supabase
            .from('enrollments')
            .select('course_id')
            .in('course_id', courseIds);

        // Build enrollment count map
        const enrollmentMap = {};
        if (!enrollError && enrollments) {
            enrollments.forEach(e => {
                enrollmentMap[e.course_id] = (enrollmentMap[e.course_id] || 0) + 1;
            });
        }

        // Map course data with enrollment counts
        const courseData = courses.map((course) => {
            const totalStudentsEnrolled = enrollmentMap[course.id] || 0;
            const totalAmountGenerated = totalStudentsEnrolled * (course.price || 0);

            return {
                id: course.id,
                courseName: course.title,
                courseDescription: course.description,
                totalStudentsEnrolled,
                totalAmountGenerated,
            }
        });

        res.status(200).json({ success: true, courses: courseData })
    } catch (error) {
        console.error('Error in instructorDashboard:', error)
        res.status(500).json({ 
            success: false, 
            message: "Unable to fetch instructor dashboard data",
            error: error.message 
        })
    }
}
