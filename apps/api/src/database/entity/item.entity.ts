import { Entity, PrimaryGeneratedColumn, Column, Index, BaseEntity, UpdateDateColumn, CreateDateColumn, DeleteDateColumn, BeforeInsert, ManyToOne, JoinColumn, Relation, OneToMany, Transaction } from "typeorm";
import { Master } from "./master.entity";
import { Category } from "./category.entity";
import { Location } from "./location.entity";

@Entity('items')
export class Item extends BaseEntity {
    @PrimaryGeneratedColumn('uuid')
    id!: string;

    @Column({ name: 'master_id' })
    masterId!: string;

    @ManyToOne('Master', 'items')
    @JoinColumn({
        name: 'master_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'FK_items_masters'
    })
    master?: Relation<Master>;

    @Column({ name: 'location_id' })
    locationId!: string;

    @ManyToOne('Location', 'items')
    @JoinColumn({
        name: 'location_id',
        referencedColumnName: 'id',
        foreignKeyConstraintName: 'FK_items_locations'
    })
    location?: Relation<Location>;

    @Column({ type: 'integer' })
    stock!: number;

    @Column({ name: 'exp_date', type: 'timestamp with time zone', nullable: true })
    expDate?: Date

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

    @OneToMany('Transaction', 'items')
    transactions?: Relation<Transaction[]>
}