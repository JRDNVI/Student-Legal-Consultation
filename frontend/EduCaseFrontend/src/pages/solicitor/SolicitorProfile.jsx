import React, { useState } from "react";
import useDashboardData from "../../hooks/useDashboardData";
import ProfileOverview from "../../components/general/ProfileOverview";
import LoadingSpinner from "../../components/general/LoadingSpinner";
import Modal from "../../components/general/Modal"
import EditProfile from "../../components/forms/EditProfile";

const SolicitorProfilePage = () => {
    const { data, loading, refetch } = useDashboardData();
    const [showEdit, setShowEdit] = useState(false);

    if (loading) return <LoadingSpinner title="Profile" />;

    const solicitorId = data?.solicitors?.[0]?.solicitor_id;
    console.log("Solicitor ID:", solicitorId);

    const handleEditSubmit = async (formData) => {
        console.log("Solicitor profile form submitted", formData);
        setShowEdit(false);
        refetch();
    }

    return (
        <>
            <ProfileOverview
                role="solicitor"
                data={data}
                onEdit={() => setShowEdit(true)}
            />

            <Modal
                isOpen={showEdit}
                onClose={() => setShowEdit(false)}
                title="Edit Solicitor Profile"
            >
                <EditProfile
                    role="solicitor"
                    data={data}
                    onCancel={() => setShowEdit(false)}
                    onSubmit={handleEditSubmit}
                    id={solicitorId}
                />
            </Modal>

        </>
    );
};

export default SolicitorProfilePage;
