// Navbar Component - Example extraction
// To use this pattern, define components in separate files and make them available globally

window.Navbar = ({ toggleSidebar, username, currentPage, userId, onLogout, theme, onToggleTheme, navigateTo, toggleProfile }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [notifications, setNotifications] = useState([
        { id: 1, type: 'battle', message: 'You have a battle invite from Player1!', read: false },
        { id: 2, type: 'friend', message: 'CodeMaster101 sent you a friend request', read: false },
        { id: 3, type: 'achievement', message: 'You earned the "Speed Demon" badge!', read: true }
    ]);

    const toggleNotifications = () => setShowNotifications(!showNotifications);

    const markAsRead = (id) => {
        setNotifications(prev => prev.map(notif => 
            notif.id === id ? { ...notif, read: true } : notif
        ));
    };

    return React.createElement('nav', {
        className: `fixed top-0 left-0 right-0 z-50 px-4 py-3 bg-gray-800 border-b border-gray-700 flex items-center justify-between ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'}`
    }, [
        // Left side - Menu button and logo
        React.createElement('div', { key: 'left', className: 'flex items-center space-x-4' }, [
            React.createElement('button', {
                key: 'menu',
                onClick: toggleSidebar,
                className: 'lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white',
                'aria-label': 'Toggle sidebar'
            }, [
                React.createElement('svg', {
                    key: 'icon',
                    className: 'h-6 w-6',
                    xmlns: 'http://www.w3.org/2000/svg',
                    fill: 'none',
                    viewBox: '0 0 24 24',
                    stroke: 'currentColor'
                }, [
                    React.createElement('path', {
                        key: 'path',
                        strokeLinecap: 'round',
                        strokeLinejoin: 'round',
                        strokeWidth: 2,
                        d: 'M4 6h16M4 12h16M4 18h16'
                    })
                ])
            ]),
            React.createElement('div', { key: 'logo', className: 'flex items-center space-x-3' }, [
                React.createElement('div', {
                    key: 'logo-bg',
                    className: 'w-8 h-8 bg-gradient-to-r from-purple-500 to-blue-600 rounded-lg flex items-center justify-center'
                }, [
                    React.createElement('span', {
                        key: 'logo-text',
                        className: 'text-white font-bold text-sm'
                    }, 'C')
                ]),
                React.createElement('span', {
                    key: 'brand',
                    className: 'text-xl font-bold text-white hidden sm:block'
                }, 'Codera')
            ])
        ]),

        // Right side - Theme toggle, notifications, avatar, logout
        React.createElement('div', { key: 'right', className: 'flex items-center space-x-4' }, [
            // Theme toggle
            React.createElement('button', {
                key: 'theme',
                onClick: onToggleTheme,
                className: 'p-2 rounded-full hover:bg-gray-700 transition duration-200',
                'aria-label': 'Toggle theme',
                title: `Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`
            }, [
                theme === 'dark' 
                    ? React.createElement('svg', {
                        key: 'sun',
                        className: 'h-5 w-5 text-yellow-400',
                        fill: 'currentColor',
                        viewBox: '0 0 20 20'
                    }, [
                        React.createElement('path', {
                            key: 'sun-path',
                            fillRule: 'evenodd',
                            d: 'M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z',
                            clipRule: 'evenodd'
                        })
                    ])
                    : React.createElement('svg', {
                        key: 'moon',
                        className: 'h-5 w-5 text-gray-400',
                        fill: 'currentColor',
                        viewBox: '0 0 20 20'
                    }, [
                        React.createElement('path', {
                            key: 'moon-path',
                            d: 'M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z'
                        })
                    ])
            ]),

            // Notifications
            React.createElement('div', { key: 'notifications', className: 'relative' }, [
                React.createElement('button', {
                    key: 'notif-btn',
                    onClick: toggleNotifications,
                    className: 'p-2 rounded-full hover:bg-gray-700 transition duration-200 relative',
                    'aria-label': 'Notifications'
                }, [
                    React.createElement('svg', {
                        key: 'bell',
                        className: 'h-6 w-6 text-gray-300',
                        fill: 'none',
                        stroke: 'currentColor',
                        viewBox: '0 0 24 24'
                    }, [
                        React.createElement('path', {
                            key: 'bell-path',
                            strokeLinecap: 'round',
                            strokeLinejoin: 'round',
                            strokeWidth: 2,
                            d: 'M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9'
                        })
                    ]),
                    notifications.some(n => !n.read) && React.createElement('span', {
                        key: 'badge',
                        className: 'absolute -top-1 -right-1 h-4 w-4 bg-red-500 text-white rounded-full text-xs flex items-center justify-center'
                    }, notifications.filter(n => !n.read).length)
                ]),

                // Notifications dropdown
                showNotifications && React.createElement('div', {
                    key: 'dropdown',
                    className: 'absolute right-0 mt-2 w-80 bg-gray-800 rounded-md shadow-lg py-1 z-50 border border-gray-700'
                }, [
                    React.createElement('div', {
                        key: 'header',
                        className: 'px-4 py-2 border-b border-gray-700'
                    }, [
                        React.createElement('h3', {
                            key: 'title',
                            className: 'text-lg font-medium text-white'
                        }, 'Notifications')
                    ]),
                    React.createElement('div', {
                        key: 'list',
                        className: 'max-h-64 overflow-y-auto custom-scrollbar'
                    }, notifications.map(notification => 
                        React.createElement('div', {
                            key: notification.id,
                            className: `px-4 py-3 hover:bg-gray-700 cursor-pointer ${!notification.read ? 'bg-gray-750' : ''}`,
                            onClick: () => markAsRead(notification.id)
                        }, [
                            React.createElement('p', {
                                key: 'message',
                                className: `text-sm ${!notification.read ? 'text-white font-medium' : 'text-gray-300'}`
                            }, notification.message),
                            React.createElement('span', {
                                key: 'type',
                                className: `inline-block mt-1 px-2 py-1 rounded-full text-xs ${
                                    notification.type === 'battle' ? 'bg-red-500 text-white' :
                                    notification.type === 'friend' ? 'bg-blue-500 text-white' :
                                    'bg-green-500 text-white'
                                }`
                            }, notification.type.charAt(0).toUpperCase() + notification.type.slice(1))
                        ])
                    ))
                ])
            ]),

            // Avatar
            React.createElement('button', {
                key: 'avatar',
                onClick: toggleProfile,
                className: 'p-2 rounded-full hover:bg-gray-700 transition duration-200',
                'aria-label': 'User avatar'
            }, [
                React.createElement('img', {
                    key: 'avatar-img',
                    src: 'https://placehold.co/32x32/FF7700/FFFFFF?text=CM',
                    alt: 'User Avatar',
                    className: 'h-8 w-8 rounded-full'
                })
            ]),

            // Logout Button
            React.createElement('button', {
                key: 'logout',
                onClick: onLogout,
                className: 'px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded-md text-sm font-medium transition duration-200'
            }, 'Logout')
        ])
    ]);
};

// Make it available globally
window.Components = window.Components || {};
window.Components.Navbar = window.Navbar;