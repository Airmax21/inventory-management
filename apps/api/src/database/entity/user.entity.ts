import bcrypt from "bcryptjs";
import { Entity, PrimaryGeneratedColumn, Column, Index, BaseEntity, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert } from "typeorm";

export enum RoleEnum {
    ADMIN = 'admin',
    USER = 'user'
}

@Entity('users')
@Index('UQ_user_name', ['username', 'email'], {
    unique: true,
    where: '(deleted_at IS NULL)'
})
export class User extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ type: 'citext' })
    username!: string;

    @Column({ type: 'citext' })
    email!: string;

    @Column({ type: 'text', select: false })
    password!: string;

    @Column({ type: 'citext' })
    name?: string;

    @Column({ type: 'enum', enum: RoleEnum, nullable: false })
    role!: RoleEnum

    @CreateDateColumn({ name: 'created_at', type: 'timestamp with time zone' })
    createdAt!: Date;

    @UpdateDateColumn({ name: 'updated_at', type: 'timestamp with time zone' })
    updatedAt!: Date;

    @DeleteDateColumn({
        nullable: true,
        name: 'deleted_at',
        type: 'timestamp with time zone',
        default: null,
    })
    deletedAt!: Date | null;

    @BeforeInsert()
    async hashPassword() {
        this.password = await bcrypt.hash(this.password, 10);
    }
}