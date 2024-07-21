import { Fragment, useEffect, useState } from 'react';
import './App.css';

interface MenuType {
  idx: number;
  parentIdx: number;
  name: string;
  child?: MenuType[];
}

function App() {
  const [maxMenuIdx, setMaxMenuIdx] = useState(0);
  const [menu, setMenu] = useState<MenuType[]>([
    {
      idx: 1,
      parentIdx: 0,
      name: '🌼 메뉴 1',
    },
  ]);

  // 최대 인덱스 값 추출
  useEffect(() => {
    const calculateMaxIdx = (menu: MenuType[]) => {
      let maxMenuIdx = 0;
      const findMaxMenuIdx = (menu: MenuType[]) => {
        menu.map((item: MenuType) => {
          if (item.idx > maxMenuIdx) {
            maxMenuIdx = item.idx;
          }
          // child 속성이 있으면 재귀 start
          if (item.child) {
            findMaxMenuIdx(item.child);
          }
        });
      };
      findMaxMenuIdx(menu);
      return maxMenuIdx;
    };
    setMaxMenuIdx(calculateMaxIdx(menu));
  }, [menu]);

  // 추가 함수
  const addMenu = (newMenu: MenuType) => {
    // 추가 재귀 함수
    const addRecursively = (menus: MenuType[]): MenuType[] => {
      return menus.map((menusItem) => {
        // 맵 돌려서 만난 인덱스와 새로 추가하려는 부모의 인덱스가 같으면
        if (menusItem.idx === newMenu.parentIdx) {
          return {
            ...menusItem,
            child: menusItem.child ? [...menusItem.child, newMenu] : [newMenu], // child에 값을 추가한다
          };
        }

        // child가 있다면 재귀함수 실행
        if (menusItem.child) {
          return {
            ...menusItem,
            child: addRecursively(menusItem.child),
          };
        }
        return menusItem;
      });
    };

    // setMenu 업데이트
    setMenu(newMenu.parentIdx === 0 ? [...menu, newMenu] : addRecursively(menu));
  };

  // 수정 함수
  const modifyMenu = (updateMenu: MenuType) => {
    // 수정 재귀 함수
    const modifyRecursively = (menus: MenuType[]): MenuType[] => {
      return menus.map((menusItem) => {
        // 맵 돌려서 만난 인덱스와 수정하려는 인덱스가 같으면
        if (menusItem.idx === updateMenu.idx) {
          return {
            idx: updateMenu.idx,
            parentIdx: updateMenu.parentIdx,
            name: `🍀 수정된 메뉴 ${updateMenu.idx}`,
          };
        }

        // child가 있다면 재귀함수 실행
        if (menusItem.child) {
          return {
            ...menusItem,
            child: modifyRecursively(menusItem.child),
          };
        }
        return menusItem;
      });
    };

    // setMenu 업데이트
    setMenu(modifyRecursively(menu));
  };

  // 삭제 함수
  const removeMenu = (deleteMenu: MenuType) => {
    // 삭제 재귀 함수
    const removeRecursively = (menus: MenuType[]): MenuType[] => {
      return menus
        .filter((menusItem) => menusItem.idx !== deleteMenu.idx)
        .map((menusItem) => {
          if (menusItem.child) {
            return {
              ...menusItem,
              child: removeRecursively(menusItem.child),
            };
          }
          return menusItem;
        });
    };

    // setMenu 업데이트
    setMenu(removeRecursively(menu));
  };

  return (
    <div>
      <div className="border rounded-lg m-4 py-2 px-4 h-60 w-96">
        {menu.map((menuItem) => {
          return (
            <Fragment key={menuItem.idx}>
              {/* 재귀 컴포넌트 */}
              <MenuRecursively
                node={menuItem}
                addMenu={addMenu}
                maxMenuIdx={maxMenuIdx}
                modifyMenu={modifyMenu}
                removeMenu={removeMenu}
              />
            </Fragment>
          );
        })}
        {/* 추가 버튼 */}
        <div
          className="badge badge-outline gap-2 mt-3 cursor-pointer"
          onClick={() => {
            addMenu({
              idx: maxMenuIdx + 1,
              name: `🌼 메뉴 ${maxMenuIdx + 1}`,
              parentIdx: 0,
            });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 21 20"
            fill="none"
          >
            <path
              d="M10.5 4.16669V15.8334"
              stroke="#1D273B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.66669 10H16.3334"
              stroke="#1D273B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mt-[1.5px]">추가</span>
        </div>
      </div>
    </div>
  );
}
// 재귀 컴포넌트
const MenuRecursively = ({
  node,
  addMenu,
  modifyMenu,
  removeMenu,
  maxMenuIdx,
}: {
  node: MenuType;
  addMenu: (menu: MenuType) => void;
  modifyMenu: (menu: MenuType) => void;
  removeMenu: (menu: MenuType) => void;
  maxMenuIdx: number;
}) => {
  const [openMenus, setOpenMenus] = useState<{ [key: string]: boolean }>({});

  return (
    <div className="ml-4">
      <div className="flex">
        <div
          className="cursor-pointer "
          onClick={() => {
            // 인덱스를 찾아서 open 토글 시킨다.
            setOpenMenus((prev) => ({ ...prev, [node.idx]: !prev[node.idx] }));
          }}
        >
          {node.name}
        </div>
        {/* 추가 버튼 */}
        <div
          className="badge badge-outline gap-2 mt-[2.5px] cursor-pointer ml-4"
          onClick={() => {
            setOpenMenus((prev) => ({ ...prev, [node.idx]: true }));
            addMenu({
              idx: maxMenuIdx + 1,
              name: `🌸 메뉴 ${maxMenuIdx + 1}`,
              parentIdx: node.idx,
            });
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 21 20"
            fill="none"
          >
            <path
              d="M10.5 4.16669V15.8334"
              stroke="#1D273B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M4.66669 10H16.3334"
              stroke="#1D273B"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mt-[1.5px]">추가</span>
        </div>
        {/* 수정 버튼 */}
        <div
          className="badge badge-outline gap-2 mt-[2.5px] cursor-pointer ml-1"
          onClick={() => {
            modifyMenu(node);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 21 20"
            fill="none"
          >
            <path
              d="M3.83331 16.6667H7.16665L15.9166 7.91669C16.3587 7.47467 16.607 6.87515 16.607 6.25003C16.607 5.62491 16.3587 5.02539 15.9166 4.58336C15.4746 4.14133 14.8751 3.89301 14.25 3.89301C13.6249 3.89301 13.0253 4.14133 12.5833 4.58336L3.83331 13.3334V16.6667Z"
              stroke="#1D273B"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M11.75 5.41669L15.0833 8.75002"
              stroke="#1D273B"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span className="mt-[1.5px]">수정</span>
        </div>
        {/* 삭제 버튼 */}
        <div
          className="badge badge-outline gap-2 mt-[2.5px] cursor-pointer ml-1"
          onClick={() => {
            removeMenu(node);
          }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16px" height="16px">
            <path d="M 10 2 L 9 3 L 3 3 L 3 5 L 4.109375 5 L 5.8925781 20.255859 L 5.8925781 20.263672 C 6.023602 21.250335 6.8803207 22 7.875 22 L 16.123047 22 C 17.117726 22 17.974445 21.250322 18.105469 20.263672 L 18.107422 20.255859 L 19.890625 5 L 21 5 L 21 3 L 15 3 L 14 2 L 10 2 z M 6.125 5 L 17.875 5 L 16.123047 20 L 7.875 20 L 6.125 5 z" />
          </svg>
          <span className="mt-[1.5px]">삭제</span>
        </div>
      </div>

      {/* 자식의 자식 재귀 컴포넌트 */}
      {openMenus[node.idx] &&
        node.child &&
        node.child.map((childItem) => {
          return (
            <Fragment key={childItem.idx}>
              <MenuRecursively
                node={childItem}
                maxMenuIdx={maxMenuIdx}
                addMenu={addMenu}
                modifyMenu={modifyMenu}
                removeMenu={removeMenu}
              />
            </Fragment>
          );
        })}
    </div>
  );
};

{
  /* 재귀 컴포넌트 */
}

export default App;
