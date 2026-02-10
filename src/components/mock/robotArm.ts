export const robotArm = {
  mockSelectedPart: [
    {
      id: "robotArm",
      name: "로봇팔",
      core: "•고정된 베이스에 여러 개의 링크와 회전 관절이 직렬로 연결된 다관절 매니퓰레이터로, 끝단에는 물체를 잡거나 밀 수 있는 엔드이펙터가 달려있습니다.",
      usage:
        "• 반복 정밀 위치 제어가 필요한 작업(피킹·조립·용접·검사 등)에서 사람 팔을 대신해 물체를 잡고 움직이는 역할을 합니다.",
      principle: `• 각 관절에 장착된 모터가 특정 각도로 회전하면, 해당 관절에 연결된 링크가 함께 회전하면서 로봇팔의 자세가 바뀝니다.

• 여러 관절의 회전을 조합하면, 엔드이펙터의 위치와 방향을 3차원 공간의 원하는 점으로 이동시킬 수 있습니다.

• 제어기는 목표 위치(또는 궤적)와 현재 관절각을 비교하고, 필요한 만큼 모터에 전류를 보내 각 관절을 미세하게 조정합니다.`,
    },
    {
      id: "base",
      name: "베이스(기단부)",
      usage:
        "로봇팔 전체를 바닥이나 프레임에 고정하고, 상부 회전축을 지지하는 기준 구조물",
      material:
        "구조 강도와 가공성을 고려한 탄소강 또는 알루미늄 합금 판재·디스크 사용",
    },
    {
      id: "waist",
      name: "Waist Ling(허리)",
      usage: "베이스 위에 안착되어 전체 암(Arm)을 좌우로 회전시키는 연결부",
      material: "알루미늄 또는 강화 플라스틱",
    },
    {
      id: "lowerArm",
      name: "하부 암",
      usage: "로봇의 '상완' 역할, 큰 토크를 견디며 작업 반경을 결정합니다.",
      material: "AL6061 또는 탄소섬유",
    },
    {
      id: "upperArm",
      name: "Upper Arm(상부 암)",
      usage: "전완' 역할로 리스트(Wrist)와 연결되어 복잡한 각도를 구현합니다.",
      material: "AL6061 (경량화 필수)",
    },
    {
      id: "wristJoint",
      name: "Wrist Joint(손목 관절)",
      usage: "엔드이펙터의 방향(Orientation)을 결정하는 다축 관절 뭉치",
      material: "스테인리스강 또는 알루미늄",
    },
    {
      id: "wristLink",
      name: "Wrist Link(커넥터)",
      usage: "엔드이펙터의 방향(Orientation)을 결정하는 다축 관절 뭉치",
      material: "스테인리스강 또는 알루미늄",
    },
    {
      id: "gripperFrame",
      name: "Gripper Frame (집게 몸체)",
      usage: "물체를 잡기 위한 메커니즘이 수용되는 프레임",
      material: "강화 플라스틱 (POM/PA)",
    },
    {
      id: "gripperFinger",
      name: "Gripper Finger(집게 날)",
      usage: "실제 물체와 접촉하여 파지력을 가하는 부품",
      material: "고무 코팅된 알루미늄/ABS",
    },
  ],
};
