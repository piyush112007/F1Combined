'use client';

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { F1_DRIVERS, DriverAvatar } from '../utils/drivers';
import { RxCross2 } from 'react-icons/rx';
import styles from './DriverAvatarModal.module.css';

export default function DriverAvatarModal() {
  const { isAvatarModalOpen, closeAvatarModal, driverAvatar, setDriverAvatar } = useAuth();

  if (!isAvatarModalOpen) return null;

  const handleSelect = (driver: DriverAvatar) => {
    setDriverAvatar(driver);
    closeAvatarModal();
  };

  return (
    <div className={styles.overlay} onClick={closeAvatarModal} aria-hidden="true">
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div>
            <div className={styles.headerTitle}>Select Your F1 Driver Avatar</div>
            <div className={styles.headerSub}>Choose your driver headshot to display in your profile & navbar</div>
          </div>
          <button className={styles.closeBtn} onClick={closeAvatarModal} aria-label="Close">
            <RxCross2 size={20} />
          </button>
        </div>

        <div className={styles.grid}>
          {F1_DRIVERS.map((driver) => {
            const isSelected = driverAvatar.id === driver.id;
            return (
              <div
                key={driver.id}
                className={`${styles.card} ${isSelected ? styles.activeCard : ''}`}
                onClick={() => handleSelect(driver)}
              >
                <div className={styles.avatarWrapper}>
                  <img
                    src={driver.headshotUrl}
                    alt={driver.name}
                    className={styles.avatarImg}
                    onError={(e) => {
                      // Fallback text avatar on image load failure
                      (e.target as HTMLElement).style.display = 'none';
                      const parent = (e.target as HTMLElement).parentElement;
                      if (parent && !parent.querySelector(`.${styles.fallbackAvatar}`)) {
                        const fallback = document.createElement('div');
                        fallback.className = styles.fallbackAvatar;
                        fallback.style.backgroundColor = driver.teamColor;
                        fallback.innerText = driver.code;
                        parent.appendChild(fallback);
                      }
                    }}
                  />
                </div>
                <div className={styles.driverCode}>{driver.code} #{driver.number}</div>
                <div className={styles.driverName}>{driver.name}</div>
                <div
                  className={styles.teamBadge}
                  style={{ backgroundColor: driver.teamColor }}
                >
                  {driver.team}
                </div>
              </div>
            );
          })}
        </div>

        <div className={styles.footer}>
          <button className={styles.confirmBtn} onClick={closeAvatarModal}>
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
