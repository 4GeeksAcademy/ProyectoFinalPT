export const initialStore = () => {
  return {
    message: null,
    todos: [
      { id: 1, title: "Make the bed", background: null },
      { id: 2, title: "Do my homework", background: null }
    ],
    profile: {
      name: "Nombre de Usuario",
      email: "correo@delusuario.com",
      presentation: "Breve presentación del usuario. Haz clic en 'Editar Perfil' para cambiar esto.",
      location: "Vive en Madrid",
      age: 26,
      phone: "666 000 666",
      gender: "Género sin especificar",
      social: {
        instagram: "usuario_ig",
        twitter: "usuario_tw",
        facebook: "usuario_fb"
      },
      avatar: "https://res.cloudinary.com/dmx0zjkej/image/upload/v1762540958/LOGO_600_x_600_muoehy.png"
    },
    clans: [
      { id: 1, name: "Los geek's", category: "Grupo de Trabajo", members: 4, created: "2025-11-03" },
      { id: 2, name: "Familia", category: "Familia", members: 3, created: "2025-10-01" },
      { id: 3, name: "Novia/o", category: "Social", members: 2, created: "2025-09-15" }
    ],
    activeClanId: 1,
    tasks: [
        { id: 101, clanId: 1, title: "Terminar el proyecto final", completed: false },
        { id: 102, clanId: 1, title: "Preparar la presentación", completed: false },
        { id: 103, clanId: 1, title: "Revisar el backend", completed: true },
        { id: 104, clanId: 2, title: "Comprar pan", completed: false },
        { id: 105, clanId: 2, title: "Llamar a la abuela", completed: false },
        { id: 106, clanId: 3, title: "Reservar restaurante para el viernes", completed: false }
    ],
    personalBote: 100.00
  }
}
    token: localStorage.getItem("token") || null,
    message: null,
    tareas: [
      {
        id: 1,
        titulo: "Hacer la compra",
        descripcion: "",
        fecha: "2025-11-13",
        hora: "10:00",
        direccion: "Calle Santoña 56, Madrid",
        invitados: ["juan@gmail.com"],
        lat: 40.3926,
        lng: -3.7016,
      },
      {
        id: 2,
        titulo: "Quedada para el cine",
        descripcion: "",
        fecha: "2025-11-14",
        hora: "18:00",
        direccion: "Calle del Santuario 70, Madrid",
        invitados: ["ana@gmail.com", "luis@gmail.com"],
        lat: 40.3926,
        lng: -3.7016,
      },
    ],
  };
};

// Reducer que maneja todas las acciones
export default function storeReducer(store, action = {}) {
  switch (action.type) {
    case 'set_hello':
      return { ...store, message: action.payload };

    case 'add_task':
      const { id, color } = action.payload
      return {
        ...store,
        todos: store.todos.map((todo) => (todo.id === id ? { ...todo, background: color } : todo))
      };
    
    // Acciones de Perfil
    case 'UPDATE_PROFILE':
      return {
        ...store,
        profile: { ...store.profile, ...action.payload }
      };
    case 'UPDATE_PERSONAL_BOTE':
      return {
        ...store,
        personalBote: parseFloat(action.payload.newBote)
      };

    // Acciones de Clanes / Grupos
    case 'CREATE_CLAN':
      const newClan = {
        id: new Date().getTime(), 
        ...action.payload, 
        members: 1 
      };
      return {
        ...store,
        clans: [...store.clans, newClan]
      };
    case 'JOIN_CLAN':
      console.log("Intentando unirse al clan con código:", action.payload.code);
      return store;
    case 'SET_ACTIVE_CLAN':
      return {
        ...store,
        activeClanId: action.payload.clanId
      };
    case 'DELETE_CLAN':
      if (!store.activeClanId) return store; 
      const remainingClans = store.clans.filter(clan => clan.id !== store.activeClanId);
      const remainingTasks = store.tasks.filter(task => task.clanId !== store.activeClanId);
      return {
        ...store,
        clans: remainingClans,
        tasks: remainingTasks,
        activeClanId: remainingClans.length > 0 ? remainingClans[0].id : null
      };

    // Acciones de Tareas de Clan 
    case 'ADD_TASK_TO_CLAN':
      if (!store.activeClanId) return store; 
      const newTask = {
        id: new Date().getTime(),
        clanId: store.activeClanId,
        title: action.payload.title,
        completed: false
      };
      return {
        ...store,
        tasks: [...store.tasks, newTask]
      };
    
    // ACCIÓN PARA ELIMINAR TAREA DE CLAN 
    case 'DELETE_CLAN_TASK':
      const updatedTasks = store.tasks.filter(task => task.id !== action.payload.taskId);
      return {
        ...store,
        tasks: updatedTasks
      };

    default:
      throw Error('Unknown action.');
  }
}