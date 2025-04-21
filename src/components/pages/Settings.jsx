import { useState } from 'react';
import { Settings, Bell, LayoutGrid, CalendarDays, Monitor, Shield, User } from 'lucide-react';

export default function SettingsDashboard({darkTheme, setDarkTheme}) {
  const [activeSection, setActiveSection] = useState('notifications');

  // Стани для NotificationsSection
  const [commentsNotif, setCommentsNotif] = useState(true);
  const [mentionsNotif, setMentionsNotif] = useState(true);
  const [updatesNotif, setUpdatesNotif] = useState(false);
  const [remindersNotif, setRemindersNotif] = useState(true);
  const [messagesNotif, setMessagesNotif] = useState(false);

  // Стани для InterfaceSection
  const [showAnimations, setShowAnimations] = useState(true);
  const [enableShortcuts, setEnableShortcuts] = useState(true);

  const sections = [
    { id: 'notifications', name: 'Notifications', icon: <Bell className="w-4 h-4" /> },
    { id: 'interface', name: 'Interface', icon: <Monitor className="w-4 h-4" /> },
  ];

  const renderSection = () => {
    switch (activeSection) {
      case 'notifications':
        return (
          <NotificationsSection
            commentsNotif={commentsNotif}
            setCommentsNotif={setCommentsNotif}
            mentionsNotif={mentionsNotif}
            setMentionsNotif={setMentionsNotif}
            updatesNotif={updatesNotif}
            setUpdatesNotif={setUpdatesNotif}
            remindersNotif={remindersNotif}
            setRemindersNotif={setRemindersNotif}
            messagesNotif={messagesNotif}
            setMessagesNotif={setMessagesNotif}
            darkTheme={darkTheme}
          />
        );
      case 'interface':
        return (
          <InterfaceSection
            darkTheme={darkTheme}
            setDarkTheme={setDarkTheme}
            showAnimations={showAnimations}
            setShowAnimations={setShowAnimations}
            enableShortcuts={enableShortcuts}
            setEnableShortcuts={setEnableShortcuts}
          />
        );
      default:
        return (
          <NotificationsSection
            commentsNotif={commentsNotif}
            setCommentsNotif={setCommentsNotif}
            mentionsNotif={mentionsNotif}
            setMentionsNotif={setMentionsNotif}
            updatesNotif={updatesNotif}
            setUpdatesNotif={setUpdatesNotif}
            remindersNotif={remindersNotif}
            setRemindersNotif={setRemindersNotif}
            messagesNotif={messagesNotif}
            setMessagesNotif={setMessagesNotif}
            darkTheme={darkTheme}
          />
        );
    }
  };

  const NotificationsSection = ({
    commentsNotif,
    setCommentsNotif,
    mentionsNotif,
    setMentionsNotif,
    updatesNotif,
    setUpdatesNotif,
    remindersNotif,
    setRemindersNotif,
    messagesNotif,
    setMessagesNotif,
    darkTheme,
  }) => (
    <div className="space-y-6">
      <div className={`border-b ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>Email Notifications</h3>
        <p className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'} mt-1 mb-4`}>Choose which email notifications you receive</p>
        <div className="space-y-3">
          <ToggleOption label="Comments" description="When someone comments on your items" checked={commentsNotif} onChange={() => setCommentsNotif(!commentsNotif)} />
          <ToggleOption label="Mentions" description="When someone mentions you" checked={mentionsNotif} onChange={() => setMentionsNotif(!mentionsNotif)} />
          <ToggleOption label="Updates" description="Product news and announcements" checked={updatesNotif} onChange={() => setUpdatesNotif(!updatesNotif)} />
        </div>
      </div>

      <div className={`border-b ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>Push Notifications</h3>
        <p className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'} mt-1 mb-4`}>Configure push notifications on this device</p>
        <div className="space-y-3">
          <ToggleOption label="Reminders" description="Upcoming deadlines and events" checked={remindersNotif} onChange={() => setRemindersNotif(!remindersNotif)} />
          <ToggleOption label="Messages" description="New direct messages" checked={messagesNotif} onChange={() => setMessagesNotif(!messagesNotif)} />
        </div>
      </div>

      <div>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>Notification Schedule</h3>
        <div className="mt-4 grid grid-cols-2 gap-4">
          <div>
            <label className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Quiet hours start</label>
            <select
              className={`block w-full ${darkTheme ? 'border-gray-700 bg-gray-800 text-gray-200' : 'border-gray-200 bg-white text-gray-600'} rounded-md text-sm focus:ring-blue-500 focus:border-blue-500`}
            >
              <option>9:00 PM</option>
              <option>10:00 PM</option>
              <option>11:00 PM</option>
            </select>
          </div>
          <div>
            <label className={`block text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'} mb-1`}>Quiet hours end</label>
            <select
              className={`block w-full ${darkTheme ? 'border-gray-700 bg-gray-800 text-gray-200' : 'border-gray-200 bg-white text-gray-600'} rounded-md text-sm focus:ring-blue-500 focus:border-blue-500`}
            >
              <option>6:00 AM</option>
              <option>7:00 AM</option>
              <option>8:00 AM</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const InterfaceSection = ({ darkTheme, setDarkTheme, showAnimations, setShowAnimations, enableShortcuts, setEnableShortcuts }) => (
    <div className="space-y-6">
      <div className={`border-b ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>Theme</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Dark Theme</span>
            <ToggleSwitch checked={darkTheme} onChange={() => setDarkTheme(!darkTheme)} />
          </div>
        </div>
      </div>

      <div className={`border-b ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>Language</h3>
        <div className="mt-4">
          <select
            className={`block w-full ${darkTheme ? 'border-gray-700 bg-gray-800 text-gray-200' : 'border-gray-200 bg-white text-gray-600'} rounded-md text-sm focus:ring-blue-500 focus:border-blue-500`}
          >
            <option>English</option>
            <option>Spanish</option>
            <option>French</option>
            <option>German</option>
          </select>
        </div>
      </div>

      <div className={`border-b ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pb-4`}>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>Display</h3>
        <div className="mt-4 space-y-3">
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Show animations</span>
            <ToggleSwitch checked={showAnimations} onChange={() => setShowAnimations(!showAnimations)} />
          </div>
          <div className="flex items-center justify-between">
            <span className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>Enable keyboard shortcuts</span>
            <ToggleSwitch checked={enableShortcuts} onChange={() => setEnableShortcuts(!enableShortcuts)} />
          </div>
        </div>
      </div>

      <div>
        <h3 className={`text-base font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>Font Size</h3>
        <div className="mt-4 flex gap-2">
          <button
            className={`px-3 py-1.5 text-sm border rounded-md ${darkTheme ? 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Small
          </button>
          <button
            className={`px-3 py-1.5 text-sm border rounded-md ${darkTheme ? 'border-blue-500 bg-blue-900 text-blue-400' : 'border-blue-500 bg-blue-50 text-blue-500'} font-medium`}
          >
            Medium
          </button>
          <button
            className={`px-3 py-1.5 text-sm border rounded-md ${darkTheme ? 'border-gray-700 bg-gray-800 text-gray-200 hover:bg-gray-700' : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'}`}
          >
            Large
          </button>
        </div>
      </div>
    </div>
  );

  const ToggleSwitch = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={onChange} className="sr-only peer" />
      <div className="w-11 h-6 bg-gray-300 rounded-full peer peer-checked:bg-blue-500 transition-colors duration-300 ease-in-out" />
      <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transform transition-transform duration-300 ease-in-out peer-checked:translate-x-5" />
    </label>
  );

  const ToggleOption = ({ label, description, checked, onChange }) => (
    <div className="flex items-center justify-between">
      <div>
        <p className={`text-sm font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'}`}>{label}</p>
        <p className={`text-sm ${darkTheme ? 'text-gray-400' : 'text-gray-500'}`}>{description}</p>
      </div>
      <ToggleSwitch checked={checked} onChange={onChange} />
    </div>
  );

  return (
    <div className={`font-poppins flex flex-col h-full custom-scroll ${darkTheme ? 'bg-gray-900' : 'bg-white'}`}>
    <style jsx global>{`
      .custom-scroll::-webkit-scrollbar {
        width: 10px;
        height: 10px;
      }
      .custom-scroll::-webkit-scrollbar-track {
        background: ${darkTheme ? 'rgba(55, 65, 81, 0.3)' : 'rgba(241, 241, 241, 0.3)'};
        border-radius: 500px;
        margin: 4px 0;
        transition: background 0.2s ease;
      }
      .custom-scroll::-webkit-scrollbar-thumb {
        background: ${darkTheme ? 'rgba(156, 163, 175, 0.8)' : 'rgba(156, 163, 175, 0.6)'};
        border-radius: 100px;
        border: 2px solid ${darkTheme ? 'rgba(55, 65, 81, 0.3)' : 'rgba(241, 241, 241, 0.3)'};
        transition: background 0.2s ease, border 0.2s ease;
      }
      .custom-scroll::-webkit-scrollbar-thumb:hover {
        background: ${darkTheme ? 'rgba(107, 114, 128, 1)' : 'rgba(107, 114, 128, 0.8)'};
      }
      .custom-scroll::-webkit-scrollbar-thumb:active {
        background: ${darkTheme ? 'rgba(75, 85, 99, 1)' : 'rgba(75, 85, 99, 0.9)'};
      }
      /* Firefox scrollbar */
      .custom-scroll {
        scrollbar-color: ${
          darkTheme
            ? 'rgba(156, 163, 175, 0.8) rgba(55, 65, 81, 0.3)'
            : 'rgba(156, 163, 175, 0.6) rgba(241, 241, 241, 0.3)'
        };
        scrollbar-width: thin;
      }
    `}</style>

      <div className={`sticky top-0 z-10 ${darkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b px-8 py-6`}>
        <h1 className={`text-xl font-medium ${darkTheme ? 'text-gray-200' : 'text-gray-600'} flex items-center`}>
          <Settings className="w-5 h-5 mr-2" />
          Settings
        </h1>
        <nav className="flex space-x-1 mt-4 overflow-x-auto pb-2 scrollbar-hide">
          {sections.map((section) => (
            <button
              key={section.id}
              onClick={() => setActiveSection(section.id)}
              className={`px-4 py-2 text-sm font-medium rounded-md flex items-center space-x-2 whitespace-nowrap transition-colors ${
                activeSection === section.id
                  ? darkTheme
                    ? 'bg-blue-900 text-blue-400'
                    : 'bg-blue-50 text-blue-500'
                  : darkTheme
                    ? 'text-gray-400 hover:bg-gray-700 hover:text-gray-200'
                    : 'text-gray-500 hover:bg-gray-50 hover:text-gray-700'
              }`}
            >
              {section.icon}
              <span>{section.name}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pb-7">
        <div className={`max-w-full ${darkTheme ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} rounded-xl border my-6`}>
          <div className="p-4">{renderSection()}</div>
          <div className={`mt-6 flex justify-end border-t ${darkTheme ? 'border-gray-700' : 'border-gray-200'} pt-4 px-4`}>
            <button className="px-4 py-2 m-3 bg-blue-500 text-white text-sm rounded-md hover:bg-blue-700 transition-colors">Save Changes</button>
          </div>
        </div>
      </div>
    </div>
  );
}