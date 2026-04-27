import React from "react";

export default function Header({ data = {} }) {
  if (!data || Object.keys(data).length === 0) {
    return (
      <div className="ls-sidebar">
        <h1 className="ls-name" style={{marginTop: 'auto', marginBottom: 'auto'}}>Loading...</h1>
      </div>
    );
  }

  const name = data.name || data.fullName || "Your Name";
  const title = data.role || data.title || data.profession || "Professional Title";

  // Using a placeholder avatar since the API doesn't seem to pass an avatar
  // In a real app, this would be data.avatar || defaultAvatar
  const avatarUrl = data.avatar || "https://api.dicebear.com/7.x/avataaars/svg?seed=" + encodeURIComponent(name);

  return (
    <div className="ls-sidebar" style={{ borderBottomLeftRadius: 0, borderBottomRightRadius: 0, borderBottom: 'none', flex: 'none' }}>
      <img src={avatarUrl} alt="Profile Avatar" className="ls-avatar" />
      <h1 className="ls-name">{name}</h1>
      <p className="ls-role">{title}</p>
    </div>
  );
}
